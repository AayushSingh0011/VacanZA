import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Search, MapPin } from 'lucide-react';
import type { Property } from '@/types';
import { formatRent, timeAgo } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { useApp } from '@/context/AppContext';

interface MapViewProps {
  properties: Property[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  height?: string;
  showControls?: boolean;
}

export function MapView({ properties, selectedId, onSelect, height = '100%', showControls = true }: MapViewProps) {
  const { navigate } = useApp();
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#eef2f0] ring-1 ring-gray-100">
      {/* Mock map background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#dde4e0" strokeWidth="0.2" />
            </pattern>
            <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#eaf0ee" />
              <stop offset="100%" stopColor="#e3ece8" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#mapBg)" />
          <rect width="100" height="100" fill="url(#grid)" />
          {/* Roads */}
          <path d="M 0 30 Q 30 28 50 35 T 100 40" stroke="#d4ddd8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 0 60 Q 40 55 60 62 T 100 65" stroke="#d4ddd8" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 25 0 Q 28 30 22 55 T 30 100" stroke="#d4ddd8" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 70 0 Q 68 35 75 60 T 72 100" stroke="#d4ddd8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* River */}
          <path d="M 0 75 Q 30 70 50 78 T 100 72" stroke="#bcd4e8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
          {/* Parks */}
          <circle cx="15" cy="15" r="6" fill="#d4e8d0" opacity="0.5" />
          <circle cx="85" cy="85" r="5" fill="#d4e8d0" opacity="0.5" />
        </svg>
      </div>

      {/* Controls */}
      {showControls && (
        <>
          <div className="absolute top-3 left-3 right-3 flex gap-2 z-20">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-sm font-medium text-navy-800 shadow-sm hover:shadow transition-all">
              <Crosshair size={15} className="text-navy-600" />
              Near me
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-sm font-medium text-navy-800 shadow-sm hover:shadow transition-all">
              <Search size={15} className="text-navy-600" />
              Search this area
            </button>
          </div>
          <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1">
            <button className="w-9 h-9 rounded-lg glass flex items-center justify-center text-navy-800 shadow-sm hover:shadow">
              <span className="text-lg font-bold leading-none">+</span>
            </button>
            <button className="w-9 h-9 rounded-lg glass flex items-center justify-center text-navy-800 shadow-sm hover:shadow">
              <span className="text-lg font-bold leading-none">−</span>
            </button>
          </div>
        </>
      )}

      {/* Markers */}
      {properties.map((p) => {
        const isVacant = p.status === 'vacant';
        const isSelected = selectedId === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onSelect?.(p.id)}
            className="absolute z-10 group"
            style={{ left: `${p.coordinates.x}%`, top: `${p.coordinates.y}%`, transform: 'translate(-50%, -100%)' }}
          >
            <div className="relative flex flex-col items-center">
              <div
                className={`relative w-7 h-7 rounded-full ring-2 ring-white shadow-md flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isVacant ? 'bg-green-500' : 'bg-red-500'
                } ${isSelected ? 'scale-125' : ''}`}
              >
                <MapPin size={14} className="text-white" fill="white" />
                {isVacant && (
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />
                )}
              </div>
              <div className={`w-2 h-2 -mt-1 rotate-45 ${isVacant ? 'bg-green-500' : 'bg-red-500'} ring-2 ring-white`} />
            </div>
          </button>
        );
      })}

      {/* Selected property preview card */}
      <AnimatePresence>
        {selectedId && (() => {
          const p = properties.find((x) => x.id === selectedId);
          if (!p) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-72 z-30"
            >
              <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 overflow-hidden">
                <div className="relative h-28">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2">
                    <StatusBadge status={p.status} size="sm" showPulse={p.status === 'vacant'} />
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-navy-900 text-sm">{p.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {p.bhk === 'Studio' ? 'Studio' : `${p.bhk} BHK`} • {p.area}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-bold text-navy-900 text-sm">{formatRent(p.rent)}/mo</span>
                    <span className="text-xs text-gray-400">Updated {timeAgo(p.lastUpdated)}</span>
                  </div>
                  <button
                    onClick={() => navigate('property-details', p.id)}
                    className="mt-2 w-full py-2 rounded-lg bg-navy-900 text-white text-xs font-medium hover:bg-navy-800 transition-colors"
                  >
                    View Property
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
