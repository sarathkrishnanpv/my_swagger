'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ApiEndpoint } from '../types/api';
import {
  Search, ChevronDown, Command,
  ClipboardList, Settings, CheckSquare,
  Calendar, BarChart3, ListChecks,
  Layout, Layers, CreditCard,
} from 'lucide-react';

const CATEGORY_META: Record<string, { icon: typeof ClipboardList; label: string }> = {
  '1. Checklist CRUD': { icon: ClipboardList, label: 'Checklist CRUD' },
  '2. Checklist Operations': { icon: Settings, label: 'Operations' },
  '3. Checklist Tasks': { icon: CheckSquare, label: 'Tasks' },
  '4. Assignment & Due Dates': { icon: Calendar, label: 'Assignment & Dates' },
  '5. Checklist Reports': { icon: BarChart3, label: 'Reports' },
  '6. Report Tasks': { icon: ListChecks, label: 'Report Tasks' },
  '7. Templates': { icon: Layout, label: 'Templates' },
  '8. Groups': { icon: Layers, label: 'Groups' },
  '9. Card APIs': { icon: CreditCard, label: 'Card APIs' },
};

const METHOD_BADGE: Record<string, string> = {
  GET: 'text-method-get bg-method-get/10 border-method-get/20',
  POST: 'text-method-post bg-method-post/10 border-method-post/20',
  PUT: 'text-method-put bg-method-put/10 border-method-put/20',
  DELETE: 'text-method-delete bg-method-delete/10 border-method-delete/20',
  PATCH: 'text-method-patch bg-method-patch/10 border-method-patch/20',
};

const METHOD_GLOW: Record<string, string> = {
  GET: '#22c55e',
  POST: '#3b82f6',
  PUT: '#f59e0b',
  DELETE: '#ef4444',
  PATCH: '#a855f7',
};

interface SidebarProps {
  endpoints: ApiEndpoint[];
  selectedEndpoint: ApiEndpoint | null;
  onSelectEndpoint: (endpoint: ApiEndpoint) => void;
}

export default function Sidebar({ endpoints, selectedEndpoint, onSelectEndpoint }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, ApiEndpoint[]>();
    endpoints.forEach(ep => {
      const list = map.get(ep.category) || [];
      list.push(ep);
      map.set(ep.category, list);
    });
    return map;
  }, [endpoints]);

  useEffect(() => {
    if (selectedEndpoint) {
      setExpanded(prev => new Set([...prev, selectedEndpoint.category]));
    }
  }, [selectedEndpoint]);

  const filtered = useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.toLowerCase();
    const result = new Map<string, ApiEndpoint[]>();
    grouped.forEach((eps, cat) => {
      const matches = eps.filter(
        ep =>
          ep.name.toLowerCase().includes(q) ||
          ep.path.toLowerCase().includes(q) ||
          ep.method.toLowerCase().includes(q)
      );
      if (matches.length > 0) result.set(cat, matches);
    });
    return result;
  }, [grouped, search]);

  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [handleKeyboard]);

  const toggle = (cat: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <aside className="w-[280px] h-screen flex flex-col bg-surface-1/80 backdrop-blur-xl border-r border-white/[0.06] shrink-0">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-xl blur-lg opacity-25" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shadow-lg shadow-accent/25">
              <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-[13px] font-semibold text-text-primary tracking-tight">Checklist V2</h2>
            <p className="text-[10px] text-text-muted font-mono tracking-wide">API REFERENCE</p>
          </div>
        </div>
      </div>

      {/* Spotlight Search */}
      <div className="px-3 pb-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-text-muted group-focus-within:text-text-secondary transition-colors" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search endpoints…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-[34px] pl-[30px] pr-[52px] text-[12px] bg-surface-0/70 border border-white/[0.06] rounded-[10px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-[2px] px-[6px] py-[3px] text-[9px] text-text-muted bg-surface-0/80 border border-white/[0.06] rounded-[5px] font-mono">
            <Command className="w-[10px] h-[10px]" />K
          </kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {Array.from(filtered.entries()).map(([category, eps]) => {
          const meta = CATEGORY_META[category] || { icon: ClipboardList, label: category };
          const Icon = meta.icon;
          const isOpen = expanded.has(category) || search.length > 0;

          return (
            <div key={category}>
              {/* Category Header */}
              <button
                onClick={() => toggle(category)}
                className="w-full flex items-center gap-2.5 px-3 py-[7px] text-[11px] font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-white/[0.03] transition-all group"
              >
                <Icon className="w-[14px] h-[14px] text-text-muted group-hover:text-text-tertiary transition-colors shrink-0" />
                <span className="flex-1 text-left truncate">{meta.label}</span>
                <span className="text-[9px] text-text-muted font-mono tabular-nums opacity-60">{eps.length}</span>
                <ChevronDown
                  className={`w-[12px] h-[12px] text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                />
              </button>

              {/* Endpoint List */}
              <div
                className="overflow-hidden transition-all duration-200 ease-out"
                style={{
                  maxHeight: isOpen ? `${eps.length * 40 + 8}px` : '0px',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="pl-1 py-0.5 space-y-[1px]">
                  {eps.map(ep => {
                    const isActive = selectedEndpoint?.id === ep.id;
                    const glowColor = METHOD_GLOW[ep.method];

                    return (
                      <button
                        key={ep.id}
                        onClick={() => onSelectEndpoint(ep)}
                        className={`relative w-full flex items-center gap-2.5 pl-4 pr-3 py-[6px] text-left rounded-lg transition-all duration-150 group/item ${
                          isActive
                            ? 'bg-white/[0.06] text-text-primary'
                            : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'
                        }`}
                      >
                        {/* Active Glow Bar */}
                        {isActive && (
                          <div
                            className="absolute left-[3px] top-1/2 -translate-y-1/2 w-[3px] h-[16px] rounded-full transition-all"
                            style={{
                              backgroundColor: glowColor,
                              boxShadow: `0 0 8px ${glowColor}50, 0 0 4px ${glowColor}30`,
                            }}
                          />
                        )}
                        <span
                          className={`shrink-0 text-[9px] font-bold font-mono w-[34px] text-center py-[2px] rounded-[4px] border leading-tight ${METHOD_BADGE[ep.method]}`}
                        >
                          {ep.method === 'DELETE' ? 'DEL' : ep.method}
                        </span>
                        <span className="text-[11px] truncate leading-tight">{ep.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.04]">
        <div className="flex items-center justify-between text-[10px] text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-[5px] h-[5px] rounded-full bg-method-get/60 animate-pulse" />
            {endpoints.length} endpoints
          </span>
          <span className="font-mono opacity-60">v2.0</span>
        </div>
      </div>
    </aside>
  );
}
