'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const AlertIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm mb-3">
    <circle cx="12" cy="12" r="10" fill="#F43F5E" />
    <path d="M12 7v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.5" fill="white" />
  </svg>
);

const SuccessIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm mb-3">
    <circle cx="12" cy="12" r="10" fill="#10B981" />
    <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const InfoIcon = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm mb-3">
    <circle cx="12" cy="12" r="10" fill="#0EA5E9" />
    <path d="M12 11v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1.5" fill="white" />
  </svg>
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Top Animation Line instead of Popups */}
      <div className="fixed top-0 left-0 w-full z-[9999] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`absolute top-0 left-0 h-1 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
              toast.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/50' :
              toast.type === 'error' ? 'bg-rose-500 shadow-rose-500/50' :
              'bg-sky-500 shadow-sky-500/50'
            }`}
            style={{ animation: 'topLineAnim 3s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
          />
        ))}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes topLineAnim {
            0% { width: 0%; opacity: 1; }
            50% { width: 70%; opacity: 1; }
            90% { width: 100%; opacity: 1; }
            100% { width: 100%; opacity: 0; }
          }
        `}} />
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
