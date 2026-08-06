import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer = () => {
  const appContext = useApp() || {};
  const { toast, toasts } = appContext;

  // Normalize toast object (supports single toast or toasts array safely)
  const activeToast = toast || (Array.isArray(toasts) && toasts.length > 0 ? toasts[0] : null);

  if (!activeToast || !activeToast.message) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border backdrop-blur-md animate-fade-in ${
          activeToast.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
            : activeToast.type === 'warning' || activeToast.type === 'error'
            ? 'bg-rose-50 text-rose-900 border-rose-200'
            : 'bg-blue-50 text-blue-900 border-blue-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {activeToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : activeToast.type === 'warning' || activeToast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{activeToast.message}</span>
        </div>
      </div>
    </div>
  );
};
