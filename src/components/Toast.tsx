import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            id={`toast-${toast.id}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto flex items-center justify-between gap-3 bg-[#111111] text-[#F7F6F2] px-4 py-3.5 rounded-xl border border-[#1F4D3A]/60 shadow-2xl shadow-black/40 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1F4D3A] text-white flex items-center justify-center shrink-0">
                {toast.type === 'info' ? (
                  <Info className="w-4 h-4 text-[#A98262]" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <p className="text-sm font-medium text-[#F7F6F2] leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#F7F6F2]/60 hover:text-white transition-colors p-1"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
