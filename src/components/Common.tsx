import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Home, Search, Bookmark, LayoutDashboard } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Page } from '@/types';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        {icon || <Home size={28} />}
      </div>
      <h3 className="font-semibold text-navy-900 text-lg">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-10 h-10 border-3 border-gray-200 border-t-navy-700 rounded-full animate-spin" />
      <p className="mt-3 text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-100">
      <div className="aspect-[16/10] skeleton" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-32 skeleton" />
          <div className="h-5 w-20 skeleton" />
        </div>
        <div className="h-4 w-40 skeleton" />
        <div className="flex gap-3">
          <div className="h-4 w-16 skeleton" />
          <div className="h-4 w-16 skeleton" />
          <div className="h-4 w-16 skeleton" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-10 flex-1 skeleton" />
          <div className="h-10 w-24 skeleton" />
        </div>
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: ReactNode; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 ring-1 ring-gray-100 shadow-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export function BottomNav() {
  const { page, navigate } = useApp();
  const items: { id: Page; label: string; icon: typeof Home }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'renter', label: 'Search', icon: Search },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'owner', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200">
      <div className="flex items-center justify-around px-2 py-1.5">
        {items.map((item) => {
          const active = page === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                active ? 'text-navy-900' : 'text-gray-400'
              }`}
            >
              <Icon size={20} fill={active ? 'currentColor' : 'none'} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
