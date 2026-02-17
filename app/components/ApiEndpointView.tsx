'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Send, ChevronDown } from 'lucide-react';
import { ApiEndpoint, ApiParameter } from '../types/api';

const METHOD_PILL: Record<string, string> = {
  GET: 'bg-method-get/15 text-method-get border-method-get/25 shadow-method-get/10',
  POST: 'bg-method-post/15 text-method-post border-method-post/25 shadow-method-post/10',
  PUT: 'bg-method-put/15 text-method-put border-method-put/25 shadow-method-put/10',
  DELETE: 'bg-method-delete/15 text-method-delete border-method-delete/25 shadow-method-delete/10',
  PATCH: 'bg-method-patch/15 text-method-patch border-method-patch/25 shadow-method-patch/10',
};

const METHOD_GRADIENT: Record<string, string> = {
  GET: 'from-method-get/[0.06] via-method-get/[0.02] to-transparent',
  POST: 'from-method-post/[0.06] via-method-post/[0.02] to-transparent',
  PUT: 'from-method-put/[0.06] via-method-put/[0.02] to-transparent',
  DELETE: 'from-method-delete/[0.06] via-method-delete/[0.02] to-transparent',
  PATCH: 'from-method-patch/[0.06] via-method-patch/[0.02] to-transparent',
};

interface ApiEndpointViewProps {
  endpoint: ApiEndpoint;
  onExecute: (
    endpoint: ApiEndpoint,
    config: {
      pathParams: Record<string, string>;
      queryParams: Record<string, string>;
      body: string;
    }
  ) => void;
  isLoading: boolean;
}

function generateDefaultBody(requestBody: Record<string, unknown>): string {
  const process = (val: unknown): unknown => {
    if (Array.isArray(val)) return val.map(item => process(item));
    if (typeof val === 'object' && val !== null) {
      const out: Record<string, unknown> = {};
      Object.entries(val).forEach(([k, v]) => { out[k] = process(v); });
      return out;
    }
    const s = String(val).toLowerCase();
    if (s.includes('number') || s.includes('position')) return 0;
    if (s.includes('boolean')) return false;
    return '';
  };
  return JSON.stringify(process(requestBody), null, 2);
}

export default function ApiEndpointView({ endpoint, onExecute, isLoading }: ApiEndpointViewProps) {
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');
  const [copiedPath, setCopiedPath] = useState(false);
  const [showBody, setShowBody] = useState(true);

  useEffect(() => {
    const pp: Record<string, string> = {};
    const qp: Record<string, string> = {};
    endpoint.parameters?.forEach(p => {
      if (p.in === 'path') pp[p.name] = '';
      if (p.in === 'query') qp[p.name] = '';
    });
    setPathParams(pp);
    setQueryParams(qp);
    setBody(endpoint.requestBody ? generateDefaultBody(endpoint.requestBody) : '');
    setShowBody(true);
  }, [endpoint]);

  const copyPath = useCallback(() => {
    navigator.clipboard.writeText(endpoint.path);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  }, [endpoint.path]);

  const handleExecute = useCallback(() => {
    onExecute(endpoint, { pathParams, queryParams, body });
  }, [onExecute, endpoint, pathParams, queryParams, body]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleExecute();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleExecute]);

  const pathParameters = endpoint.parameters?.filter(p => p.in === 'path') || [];
  const queryParameters = endpoint.parameters?.filter(p => p.in === 'query') || [];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in" key={endpoint.id}>
      {/* ═══ Hero Section ═══ */}
      <div className={`relative rounded-2xl border border-white/[0.06] bg-gradient-to-br ${METHOD_GRADIENT[endpoint.method]} overflow-hidden mb-8`}>
        {/* Subtle glow behind method */}
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${getMethodColor(endpoint.method)}20, transparent 70%)` }}
        />

        <div className="relative px-8 py-7">
          {/* Method pill + Category */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-flex items-center px-3.5 py-[5px] text-[12px] font-bold font-mono rounded-lg border shadow-sm ${METHOD_PILL[endpoint.method]}`}>
              {endpoint.method}
            </span>
            <span className="text-[11px] text-text-muted font-medium">{endpoint.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-[22px] font-bold text-text-primary leading-tight tracking-tight mb-1.5">
            {endpoint.name}
          </h1>

          {/* Description */}
          {endpoint.description && (
            <p className="text-[13px] text-text-secondary leading-relaxed mb-5">
              {endpoint.description}
            </p>
          )}

          {/* Path Bar */}
          <div className="flex items-center rounded-xl bg-surface-0/60 backdrop-blur-sm border border-white/[0.06] overflow-hidden">
            <div className="px-3 py-2.5 border-r border-white/[0.06] bg-surface-0/40">
              <span className="text-[10px] font-bold font-mono text-text-muted uppercase tracking-wider">
                {endpoint.method}
              </span>
            </div>
            <code className="flex-1 px-4 py-2.5 text-[13px] font-mono text-text-primary select-all">
              {endpoint.path}
            </code>
            <button
              onClick={copyPath}
              className="px-3 py-2.5 border-l border-white/[0.06] hover:bg-white/[0.04] transition-colors group"
              title="Copy path"
            >
              {copiedPath ? (
                <Check className="w-[14px] h-[14px] text-method-get" />
              ) : (
                <Copy className="w-[14px] h-[14px] text-text-muted group-hover:text-text-secondary transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Path Parameters ═══ */}
      {pathParameters.length > 0 && (
        <ParameterSection
          title="Path Parameters"
          parameters={pathParameters}
          values={pathParams}
          onChange={(name, val) => setPathParams(prev => ({ ...prev, [name]: val }))}
        />
      )}

      {/* ═══ Query Parameters ═══ */}
      {queryParameters.length > 0 && (
        <ParameterSection
          title="Query Parameters"
          parameters={queryParameters}
          values={queryParams}
          onChange={(name, val) => setQueryParams(prev => ({ ...prev, [name]: val }))}
        />
      )}

      {/* ═══ Request Body ═══ */}
      {endpoint.requestBody && (
        <div className="mb-8">
          <button
            onClick={() => setShowBody(!showBody)}
            className="flex items-center gap-2 mb-3 group"
          >
            <ChevronDown
              className={`w-[14px] h-[14px] text-text-muted transition-transform duration-200 ${showBody ? 'rotate-0' : '-rotate-90'}`}
            />
            <h2 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider group-hover:text-text-primary transition-colors">
              Request Body
            </h2>
            <span className="text-[9px] font-mono text-text-muted px-[6px] py-[2px] bg-surface-3/60 rounded-md border border-white/[0.04]">
              JSON
            </span>
          </button>

          <div
            className="overflow-hidden transition-all duration-200"
            style={{ maxHeight: showBody ? '600px' : '0px', opacity: showBody ? 1 : 0 }}
          >
            <div className="rounded-xl border border-white/[0.06] bg-surface-1/40 overflow-hidden">
              {/* Schema Reference */}
              <div className="px-4 py-3 border-b border-white/[0.04] bg-surface-0/30">
                <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Schema</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {Object.entries(endpoint.requestBody).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-1.5 text-[10px]">
                      <span className="font-mono font-medium text-text-secondary">{key}</span>
                      <span className="text-text-muted">→</span>
                      <span className="text-text-tertiary font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor */}
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={Math.min(Math.max(body.split('\n').length + 1, 5), 20)}
                spellCheck={false}
                className="w-full px-4 py-3 text-[12px] font-mono leading-relaxed bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none resize-y min-h-[120px]"
                placeholder='{\n  "key": "value"\n}'
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ Send Request Button ═══ */}
      <div className="pb-12">
        <button
          onClick={handleExecute}
          disabled={isLoading}
          className="group relative w-full h-[44px] overflow-hidden rounded-xl font-semibold text-[13px] text-white bg-gradient-to-r from-accent via-purple-500 to-accent bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-lg shadow-accent/15 hover:shadow-accent/25 active:scale-[0.995] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />

          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending Request…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Request
                <kbd className="hidden sm:inline text-[10px] opacity-50 ml-1 font-mono">⌘↵</kbd>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Parameter Section Sub-Component
   ───────────────────────────────────────── */

function ParameterSection({
  title,
  parameters,
  values,
  onChange,
}: {
  title: string;
  parameters: ApiParameter[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-3">
        {title}
      </h2>
      <div className="rounded-xl border border-white/[0.06] bg-surface-1/30 overflow-hidden">
        {parameters.map((param, idx) => (
          <div
            key={param.name}
            className={`px-5 py-4 hover:bg-white/[0.02] transition-colors ${
              idx < parameters.length - 1 ? 'border-b border-white/[0.04]' : ''
            }`}
          >
            {/* Param info row */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[13px] font-mono font-semibold text-text-primary">{param.name}</span>

              {/* Type pill */}
              <span className="text-[10px] font-mono px-[7px] py-[2px] rounded-md bg-surface-3/70 text-text-tertiary border border-white/[0.04]">
                {param.type}
              </span>

              {/* Location */}
              <span className="text-[10px] font-mono text-text-muted px-[6px] py-[1px] rounded bg-surface-0/40">
                {param.in}
              </span>

              {/* Required badge */}
              {param.required && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-[6px] py-[2px] rounded-md bg-method-delete/10 text-method-delete border border-method-delete/20">
                  Required
                </span>
              )}
            </div>

            {/* Description */}
            {param.description && (
              <p className="text-[11px] text-text-tertiary mb-2.5 leading-relaxed">{param.description}</p>
            )}

            {/* Input */}
            <input
              type="text"
              value={values[param.name] || ''}
              onChange={e => onChange(param.name, e.target.value)}
              placeholder={`Enter ${param.name}…`}
              className="w-full h-[32px] px-3 text-[12px] font-mono bg-surface-0/50 border border-white/[0.06] rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all hover:border-white/[0.1]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: '#22c55e',
    POST: '#3b82f6',
    PUT: '#f59e0b',
    DELETE: '#ef4444',
    PATCH: '#a855f7',
  };
  return colors[method] || '#6366f1';
}
