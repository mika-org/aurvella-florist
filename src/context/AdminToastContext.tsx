'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: {
    success: (title: string, message?: string, duration?: number) => void;
    error: (title: string, message?: string, duration?: number) => void;
    warning: (title: string, message?: string, duration?: number) => void;
    info: (title: string, message?: string, duration?: number) => void;
    custom: (toast: Omit<ToastItem, 'id'>) => void;
    persistSuccess: (title: string, message?: string) => void;
    persistError: (title: string, message?: string) => void;
    persistInfo: (title: string, message?: string) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const PERSIST_KEY = 'aurvella_admin_persist_toast';

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  // Check persisted toast on initial mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(PERSIST_KEY);
      if (stored) {
        sessionStorage.removeItem(PERSIST_KEY);
        const parsed = JSON.parse(stored);
        if (parsed && parsed.title) {
          addToast(parsed.type || 'success', parsed.title, parsed.message, 4500);
        }
      }
    } catch {}
  }, [addToast]);

  const persistToast = (type: ToastType, title: string, message?: string) => {
    try {
      sessionStorage.setItem(
        PERSIST_KEY,
        JSON.stringify({ type, title, message, timestamp: Date.now() })
      );
    } catch {}
  };

  const showToast = {
    success: (title: string, message?: string, duration?: number) =>
      addToast('success', title, message, duration),
    error: (title: string, message?: string, duration?: number) =>
      addToast('error', title, message, duration ?? 6000),
    warning: (title: string, message?: string, duration?: number) =>
      addToast('warning', title, message, duration),
    info: (title: string, message?: string, duration?: number) =>
      addToast('info', title, message, duration),
    custom: (toast: Omit<ToastItem, 'id'>) =>
      addToast(toast.type, toast.title, toast.message, toast.duration),
    persistSuccess: (title: string, message?: string) =>
      persistToast('success', title, message),
    persistError: (title: string, message?: string) =>
      persistToast('error', title, message),
    persistInfo: (title: string, message?: string) =>
      persistToast('info', title, message),
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Floating Container */}
      <div
        aria-live="assertive"
        className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          let bgClass = 'bg-white border-[#E8D9DC] text-[#2D2527]';
          let borderAccent = 'border-l-4 border-l-[#B83253]';
          let Icon = Info;
          let iconColor = 'text-[#B83253]';

          if (toast.type === 'success') {
            borderAccent = 'border-l-4 border-l-[#22C55E]';
            Icon = CheckCircle2;
            iconColor = 'text-[#22C55E]';
          } else if (toast.type === 'error') {
            borderAccent = 'border-l-4 border-l-[#EF4444]';
            Icon = AlertCircle;
            iconColor = 'text-[#EF4444]';
          } else if (toast.type === 'warning') {
            borderAccent = 'border-l-4 border-l-[#DFB758]';
            Icon = AlertTriangle;
            iconColor = 'text-[#DFB758]';
          } else {
            borderAccent = 'border-l-4 border-l-[#3B82F6]';
            Icon = Info;
            iconColor = 'text-[#3B82F6]';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-2xl p-4 shadow-xl border ${borderAccent} ${bgClass} flex items-start gap-3 transform transition-all duration-300 animate-in fade-in slide-in-from-top-4`}
              style={{
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="p-1 rounded-xl bg-[#FAF3F5] shrink-0 mt-0.5">
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="font-semibold text-xs sm:text-sm text-[#2D2527] leading-snug">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-[11px] sm:text-xs text-[#7A6D72] mt-0.5 leading-relaxed break-words">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                title="Tutup pesan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within an AdminToastProvider');
  }
  return context;
}
