import { motion } from 'framer-motion';
import type { PropertyStatus } from '@/types';
import { timeAgo, getFreshness, type Freshness } from '@/lib/utils';
import type { Property } from '@/types';

interface StatusBadgeProps {
  status: PropertyStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export function StatusBadge({ status, size = 'md', showPulse = false }: StatusBadgeProps) {
  const isVacant = status === 'vacant';
  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2',
  };
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${sizes[size]} ${
        isVacant
          ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
          : 'bg-red-50 text-red-700 ring-1 ring-red-200'
      }`}
    >
      <span className={`relative inline-flex ${dotSizes[size]}`}>
        {showPulse && isVacant && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
        )}
        <span
          className={`relative inline-flex rounded-full ${dotSizes[size]} ${
            isVacant ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      </span>
      {isVacant ? 'VACANT' : 'FULL'}
    </span>
  );
}

interface AvailabilityIndicatorProps {
  property: Property;
  size?: 'sm' | 'md' | 'lg';
}

export function AvailabilityIndicator({ property, size = 'md' }: AvailabilityIndicatorProps) {
  const freshness: Freshness = getFreshness(property);
  const isVacant = property.status === 'vacant';

  const freshnessConfig = {
    fresh: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      ring: 'ring-green-100',
      label: 'Verified',
      dot: 'bg-green-500',
    },
    stale: {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      ring: 'ring-amber-100',
      label: 'Last verified',
      dot: 'bg-amber-500',
    },
    old: {
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      ring: 'ring-amber-100',
      label: 'Last verified',
      dot: 'bg-amber-600',
    },
  };

  const cfg = freshnessConfig[freshness];
  const sizes = {
    sm: 'text-xs px-2 py-1 gap-1.5',
    md: 'text-sm px-2.5 py-1.5 gap-2',
    lg: 'text-base px-3 py-2 gap-2.5',
  };
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  if (!isVacant) {
    return (
      <span
        className={`inline-flex items-center rounded-full ${sizes[size]} bg-red-50 text-red-600 ring-1 ring-red-100`}
      >
        <span className={`rounded-full ${dotSizes[size]} bg-red-500`} />
        <span>Updated {timeAgo(property.lastUpdated)}</span>
      </span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center rounded-full ${sizes[size]} ${cfg.bg} ${cfg.color} ring-1 ${cfg.ring}`}
    >
      <span className={`rounded-full ${dotSizes[size]} ${cfg.dot}`} />
      <span>
        {cfg.label} {timeAgo(property.lastUpdated)}
      </span>
    </motion.span>
  );
}
