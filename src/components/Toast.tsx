import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import type { Toast } from '@/types';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const config = {
  success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-100' },
  info: { icon: Info, color: 'text-navy-600', bg: 'bg-navy-50', ring: 'ring-navy-100' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-100' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-100' },
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const c = config[toast.type];
          const Icon = c.icon;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="pointer-events-auto flex items-center gap-3 pl-4 pr-2 py-3 bg-white rounded-xl shadow-lg ring-1 ring-gray-100 max-w-sm"
            >
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${c.bg} ${c.color} ring-1 ${c.ring}`}>
                <Icon size={18} />
              </span>
              <p className="text-sm text-navy-800 font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => onDismiss(toast.id)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
