import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import type { BHK, FurnishedType, PropertyType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export interface Filters {
  propertyType: PropertyType | 'All';
  bhk: BHK | 'All';
  rentMin: number;
  rentMax: number;
  distanceMax: number;
  availability: 'All' | 'Vacant' | 'Full';
  furnished: FurnishedType | 'All';
}

export const defaultFilters: Filters = {
  propertyType: 'All',
  bhk: 'All',
  rentMin: 0,
  rentMax: 50000,
  distanceMax: 150,
  availability: 'All',
  furnished: 'All',
};

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const propertyTypes: (PropertyType | 'All')[] = ['All', 'House', 'Apartment', 'Flat', 'Room', 'PG'];
const bhkOptions: (BHK | 'All')[] = ['All', 'Studio', '1', '2', '3', '4+'];
const furnishedOptions: (FurnishedType | 'All')[] = ['All', 'Furnished', 'Semi-Furnished', 'Unfurnished'];

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const activeCount = Object.entries(filters).filter(([key, val]) => {
    if (key === 'rentMin') return val !== 0;
    if (key === 'rentMax') return val !== 50000;
    if (key === 'distanceMax') return val !== 150;
    return val !== 'All';
  }).length;

  const set = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {/* Availability quick filter */}
        <button
          onClick={() => set({ availability: filters.availability === 'Vacant' ? 'All' : 'Vacant' })}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filters.availability === 'Vacant'
              ? 'bg-green-500 text-white'
              : 'bg-white text-navy-700 ring-1 ring-gray-200 hover:ring-gray-300'
          }`}
        >
          Vacant only
        </button>

        {/* Property type */}
        <select
          value={filters.propertyType}
          onChange={(e) => set({ propertyType: e.target.value as PropertyType | 'All' })}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-white text-navy-700 ring-1 ring-gray-200 hover:ring-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-900/10"
        >
          {propertyTypes.map((t) => (
            <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
          ))}
        </select>

        {/* BHK */}
        <select
          value={filters.bhk}
          onChange={(e) => set({ bhk: e.target.value as BHK | 'All' })}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-white text-navy-700 ring-1 ring-gray-200 hover:ring-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-900/10"
        >
          {bhkOptions.map((b) => (
            <option key={b} value={b}>{b === 'All' ? 'All BHK' : b === 'Studio' ? 'Studio' : `${b} BHK`}</option>
          ))}
        </select>

        {/* Furnished */}
        <select
          value={filters.furnished}
          onChange={(e) => set({ furnished: e.target.value as FurnishedType | 'All' })}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-white text-navy-700 ring-1 ring-gray-200 hover:ring-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-900/10"
        >
          {furnishedOptions.map((f) => (
            <option key={f} value={f}>{f === 'All' ? 'Furnishing' : f}</option>
          ))}
        </select>

        <button
          onClick={() => setOpen(!open)}
          className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            open || activeCount > 0
              ? 'bg-navy-900 text-white'
              : 'bg-white text-navy-700 ring-1 ring-gray-200 hover:ring-gray-300'
          }`}
        >
          <SlidersHorizontal size={15} />
          More
          {activeCount > 0 && (
            <span className="ml-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            onClick={() => onChange(defaultFilters)}
            className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-navy-700"
          >
            <X size={15} />
            Clear
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 bg-white rounded-2xl ring-1 ring-gray-100 shadow-soft grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-navy-800">
                  Rent range: <span className="text-green-600 font-semibold">₹{filters.rentMin.toLocaleString()}</span> — <span className="text-green-600 font-semibold">₹{filters.rentMax.toLocaleString()}</span>
                </label>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={500}
                    value={filters.rentMin}
                    onChange={(e) => set({ rentMin: Math.min(Number(e.target.value), filters.rentMax) })}
                    className="flex-1 accent-navy-900"
                  />
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={500}
                    value={filters.rentMax}
                    onChange={(e) => set({ rentMax: Math.max(Number(e.target.value), filters.rentMin) })}
                    className="flex-1 accent-navy-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-navy-800">
                  Max distance: <span className="text-green-600 font-semibold">{filters.distanceMax} km</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={150}
                  value={filters.distanceMax}
                  onChange={(e) => set({ distanceMax: Number(e.target.value) })}
                  className="mt-3 w-full accent-navy-900"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-navy-800">Availability</label>
                <div className="mt-2 flex gap-2">
                  {(['All', 'Vacant', 'Full'] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => set({ availability: a })}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filters.availability === a
                          ? 'bg-navy-900 text-white'
                          : 'bg-gray-50 text-navy-600 ring-1 ring-gray-200'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
