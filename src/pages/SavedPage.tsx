import { motion } from 'framer-motion';
import { Bookmark, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PropertyCard } from '@/components/PropertyCard';
import { EmptyState } from '@/components/Common';

export function SavedPage() {
  const { properties, savedIds, navigate } = useApp();
  const savedProperties = properties.filter((p) => savedIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">Saved Properties</h1>
        <p className="mt-1 text-gray-500 text-sm">{savedProperties.length} saved {savedProperties.length === 1 ? 'property' : 'properties'}</p>
      </div>

      {savedProperties.length === 0 ? (
        <EmptyState
          icon={<Heart size={28} />}
          title="No saved properties yet"
          description="Tap the heart icon on any property to save it for later."
          action={{ label: 'Browse properties', onClick: () => navigate('renter') }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
