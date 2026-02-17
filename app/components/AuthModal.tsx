'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Key, LogOut, Shield, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (token: string) => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthenticate,
  onLogout,
  isAuthenticated,
}: AuthModalProps) {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setToken(localStorage.getItem('bearer_token') || '');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = token.trim();
    if (trimmed) {
      localStorage.setItem('bearer_token', trimmed);
      onAuthenticate(trimmed);
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bearer_token');
    setToken('');
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[420px] mx-4 bg-surface-2 border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-text-primary">Authentication</h3>
              <p className="text-[11px] text-text-tertiary">Bearer token authorization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.05] text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <label className="block text-[11px] font-medium text-text-secondary mb-2 uppercase tracking-wider">
            Bearer Token
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-text-muted" />
            <input
              ref={inputRef}
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={e => setToken(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Paste your bearer token…"
              className="w-full h-10 pl-9 pr-10 text-[12px] font-mono bg-surface-0/80 border border-white/[0.08] rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all"
            />
            <button
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showToken ? <EyeOff className="w-[14px] h-[14px]" /> : <Eye className="w-[14px] h-[14px]" />}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={!token.trim()}
              className="flex-1 h-[38px] text-[12px] font-semibold text-white bg-gradient-to-r from-accent to-purple-500 rounded-xl hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] shadow-lg shadow-accent/20"
            >
              {isAuthenticated ? 'Update Token' : 'Authorize'}
            </button>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="h-[38px] px-4 text-[12px] font-medium text-method-delete bg-method-delete/10 border border-method-delete/20 rounded-xl hover:bg-method-delete/15 transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Revoke
              </button>
            )}
          </div>

          {/* Status */}
          {isAuthenticated && (
            <div className="mt-3 flex items-center gap-2 text-[10px] text-method-get">
              <div className="w-[6px] h-[6px] rounded-full bg-method-get animate-pulse" />
              Token is active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
