'use client';

import { useState, useEffect } from 'react';
import { Lock, CheckCircle, Zap, Command } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ApiEndpointView from './components/ApiEndpointView';
import AuthModal from './components/AuthModal';
import ResponseViewer from './components/ResponseViewer';
import { ApiEndpoint, ApiResponse } from './types/api';
import { parseApiDocumentation } from './utils/apiParser';
import axios from 'axios';

const BASE_URL = '/proxy';

export default function Home() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const parsed = parseApiDocumentation();
    setEndpoints(parsed);
    if (parsed.length > 0) setSelectedEndpoint(parsed[0]);

    const token = localStorage.getItem('bearer_token');
    if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && response) setResponse(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [response]);

  const handleAuthenticate = (token: string) => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const handleExecuteRequest = async (
    endpoint: ApiEndpoint,
    config: {
      pathParams: Record<string, string>;
      queryParams: Record<string, string>;
      body: string;
    }
  ) => {
    setIsLoading(true);
    setResponse(null);

    try {
      const token = localStorage.getItem('bearer_token');
      let url = `${BASE_URL}${endpoint.path}`;

      Object.entries(config.pathParams).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
      });

      const queryString = Object.entries(config.queryParams)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      if (queryString) url += `?${queryString}`;

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const startTime = performance.now();

      let axiosResponse;
      const requestConfig = { headers, validateStatus: () => true };

      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
        const bodyData = config.body ? JSON.parse(config.body) : {};
        axiosResponse = await axios({
          method: endpoint.method.toLowerCase(),
          url,
          data: bodyData,
          ...requestConfig,
        });
      } else if (endpoint.method === 'DELETE') {
        axiosResponse = await axios.delete(url, requestConfig);
      } else {
        axiosResponse = await axios.get(url, requestConfig);
      }

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      const responseSize = JSON.stringify(axiosResponse.data).length;

      setResponse({
        status: axiosResponse.status,
        statusText: axiosResponse.statusText,
        data: axiosResponse.data,
        headers: axiosResponse.headers as Record<string, string>,
        time: responseTime,
        size: responseSize,
      });
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { data?: unknown } };
      setResponse({
        status: 0,
        statusText: 'Network Error',
        data: {
          error: err.message || 'Failed to execute request',
          details: err.response?.data || null,
        },
        headers: {},
        time: 0,
        size: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      {/* ═══ Left: Sidebar ═══ */}
      <Sidebar
        endpoints={endpoints}
        selectedEndpoint={selectedEndpoint}
        onSelectEndpoint={(ep) => {
          setSelectedEndpoint(ep);
          setResponse(null);
        }}
      />

      {/* ═══ Center + Right ═══ */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-[52px] flex items-center justify-between px-6 border-b border-white/[0.06] bg-surface-1/40 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
              <div className="w-[6px] h-[6px] rounded-full bg-method-get/70 animate-pulse" />
              <span className="font-mono">api.myproperty.devateam.com</span>
            </div>
            <div className="h-4 w-px bg-white/[0.06]" />
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
              <Zap className="w-3 h-3" />
              <span>Checklist V2 API</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Keyboard hints */}
            <div className="hidden md:flex items-center gap-2 text-[10px] text-text-muted">
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/[0.06] bg-surface-0/50 font-mono">
                <Command className="w-[10px] h-[10px]" />K
              </kbd>
              <span>Search</span>
              <span className="mx-1 text-text-muted/40">·</span>
              <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/[0.06] bg-surface-0/50 font-mono">
                <Command className="w-[10px] h-[10px]" />↵
              </kbd>
              <span>Send</span>
            </div>

            {/* Auth Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`relative group flex items-center gap-2 px-4 py-[7px] rounded-lg text-[12px] font-medium transition-all duration-200 ${
                isAuthenticated
                  ? 'bg-method-get/10 text-method-get border border-method-get/20 hover:bg-method-get/15'
                  : 'bg-surface-3/60 text-text-secondary border border-white/[0.08] hover:border-white/[0.12] hover:text-text-primary hover:bg-surface-3'
              }`}
            >
              {isAuthenticated ? (
                <>
                  <CheckCircle className="w-[14px] h-[14px]" />
                  <span>Authenticated</span>
                  <div className="w-[5px] h-[5px] rounded-full bg-method-get animate-pulse" />
                </>
              ) : (
                <>
                  <Lock className="w-[14px] h-[14px]" />
                  <span>Authorize</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* ═══ Center: Documentation & Testing ═══ */}
          <main className="flex-1 overflow-y-auto min-w-0">
            <div className="p-8">
              {selectedEndpoint ? (
                <ApiEndpointView
                  endpoint={selectedEndpoint}
                  onExecute={handleExecuteRequest}
                  isLoading={isLoading}
                />
              ) : (
                <EmptyState />
              )}
            </div>
          </main>

          {/* ═══ Right: Response Panel ═══ */}
          {response && (
            <ResponseViewer
              response={response}
              onClose={() => setResponse(null)}
            />
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticate={handleAuthenticate}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center max-w-sm animate-fade-in">
        {/* Icon */}
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl" />
          <div className="relative w-16 h-16 rounded-2xl bg-surface-2 border border-white/[0.06] flex items-center justify-center">
            <Zap className="w-7 h-7 text-accent/60" />
          </div>
        </div>

        <h2 className="text-[16px] font-semibold text-text-primary mb-2">
          Select an endpoint
        </h2>
        <p className="text-[13px] text-text-tertiary leading-relaxed mb-6">
          Choose an endpoint from the sidebar to view documentation and test API requests.
        </p>

        {/* Keyboard shortcut hints */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/[0.06] bg-surface-2/50 font-mono text-[10px]">
              <Command className="w-[10px] h-[10px]" />K
            </kbd>
            <span>to search</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded border border-white/[0.06] bg-surface-2/50 font-mono text-[10px]">↑↓</kbd>
            <span>to navigate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
