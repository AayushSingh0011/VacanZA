import { Search, MapPin, X } from 'lucide-react';
import { useState } from 'react';
import { areas } from '@/data/mockData';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

export function SearchBar({ value, onChange, placeholder = 'Search by area, locality or landmark', onSearch }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white ring-1 ring-gray-200 text-navy-900 placeholder:text-gray-400 focus:ring-2 focus:ring-navy-900/10 focus:outline-none transition-all text-sm"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {focused && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-lg ring-1 ring-gray-100 z-50 overflow-hidden">
          <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Popular areas</p>
          {areas.map((area) => (
            <button
              key={area}
              onMouseDown={() => {
                onChange(area);
                onSearch?.();
              }}
              className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-navy-700 hover:bg-gray-50 transition-colors text-left"
            >
              <MapPin size={15} className="text-gray-400" />
              {area}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
