import type { Property } from '@/types';

export function formatRent(rent: number): string {
  return `₹${rent.toLocaleString('en-IN')}`;
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export type Freshness = 'fresh' | 'stale' | 'old';

export function getFreshness(property: Property): Freshness {
  const diff = Date.now() - property.lastUpdated;
  if (diff < 60 * 60 * 1000) return 'fresh'; // < 1 hour
  if (diff < 24 * 60 * 60 * 1000) return 'stale'; // < 1 day
  return 'old';
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km} km`;
}
