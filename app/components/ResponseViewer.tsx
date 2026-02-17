'use client';

import { useState, useMemo } from 'react';
import { X, Clock, HardDrive, ChevronDown, Copy, Check } from 'lucide-react';
import { ApiResponse } from '../types/api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ResponseViewerProps {
  response: ApiResponse;
  onClose: () => void;
}

const STATUS_STYLE: Record<string, string> = {
  success: 'text-method-get bg-method-get/10 border-method-get/20',
  redirect: 'text-method-put bg-method-put/10 border-method-put/20',
  clientError: 'text-method-delete bg-method-delete/10 border-method-delete/20',
  serverError: 'text-method-delete bg-method-delete/10 border-method-delete/20',
  unknown: 'text-text-secondary bg-surface-3 border-white/10',
};

function getStatusCategory(status: number): string {
  if (status >= 200 && status < 300) return 'success';
  if (status >= 300 && status < 400) return 'redirect';
  if (status >= 400 && status < 500) return 'clientError';
  if (status >= 500) return 'serverError';
  return 'unknown';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResponseViewer({ response, onClose }: ResponseViewerProps) {
  const [showHeaders, setShowHeaders] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = useMemo(
    () => JSON.stringify(response.data, null, 2),
    [response.data]
  );

  const statusCat = getStatusCategory(response.status);
  const statusStyle = STATUS_STYLE[statusCat];

  const copyResponse = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-[420px] h-full flex flex-col bg-surface-1/70 backdrop-blur-xl border-l border-white/[0.06] shrink-0 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
          Response
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-white/[0.05] text-text-muted hover:text-text-primary transition-colors"
          title="Close panel"
        >
          <X className="w-[14px] h-[14px]" />
        </button>
      </div>

      {/* Status & Metrics */}
      <div className="px-4 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-3 mb-2.5">
          {/* Status Badge */}
          <span className={`px-2.5 py-[3px] text-[12px] font-bold font-mono rounded-md border ${statusStyle}`}>
            {response.status}
          </span>
          <span className="text-[12px] text-text-secondary">{response.statusText}</span>
        </div>

        {/* Micro Metrics */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-[12px] h-[12px] text-text-muted" />
            <span className="text-[11px] font-mono text-text-tertiary tabular-nums">
              {response.time}<span className="text-text-muted ml-0.5">ms</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-[12px] h-[12px] text-text-muted" />
            <span className="text-[11px] font-mono text-text-tertiary tabular-nums">
              {formatSize(response.size)}
            </span>
          </div>
        </div>
      </div>

      {/* Response Body */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Body</span>
          <button
            onClick={copyResponse}
            className="flex items-center gap-1 px-2 py-[3px] text-[10px] text-text-muted hover:text-text-secondary rounded-md border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all"
          >
            {copied ? (
              <><Check className="w-[10px] h-[10px] text-method-get" />Copied</>
            ) : (
              <><Copy className="w-[10px] h-[10px]" />Copy</>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <SyntaxHighlighter
            language="json"
            style={vscDarkPlus}
            customStyle={{
              background: 'transparent',
              margin: 0,
              padding: '14px 16px',
              fontSize: '11px',
              lineHeight: '1.65',
            }}
            showLineNumbers={false}
          >
            {jsonString}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Response Headers (collapsible) */}
      <div className="border-t border-white/[0.06]">
        <button
          onClick={() => setShowHeaders(!showHeaders)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-semibold text-text-muted uppercase tracking-wider hover:text-text-secondary transition-colors"
        >
          <span>Response Headers</span>
          <ChevronDown
            className={`w-[12px] h-[12px] transition-transform duration-200 ${showHeaders ? 'rotate-0' : '-rotate-90'}`}
          />
        </button>

        <div
          className="overflow-hidden transition-all duration-200"
          style={{
            maxHeight: showHeaders ? '200px' : '0px',
            opacity: showHeaders ? 1 : 0,
          }}
        >
          <div className="px-4 pb-3 max-h-[180px] overflow-y-auto space-y-[2px]">
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="flex gap-2 py-[2px] text-[10px] leading-relaxed">
                <span className="text-text-tertiary font-mono shrink-0 min-w-0">{key}:</span>
                <span className="text-text-secondary font-mono truncate min-w-0">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
