import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, SlidersHorizontal, Map as MapIcon, LayoutGrid, Phone, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar, defaultFilters, type Filters } from '@/components/FilterBar';
import { PropertyCard } from '@/components/PropertyCard';
import { MapView } from '@/components/MapView';
import { EmptyState, PropertyCardSkeleton } from '@/components/Common';
import { Modal } from '@/components/Modal';
import { timeAgo } from '@/lib/utils';
import type { Property } from '@/types';

export function RenterDashboard() {
  const { properties, navigate, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactProperty, setContactProperty] = useState<Property | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...properties];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.area.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q)
      );
    }

    if (filters.availability === 'Vacant') result = result.filter((p) => p.status === 'vacant');
    if (filters.availability === 'Full') result = result.filter((p) => p.status === 'full');
    if (filters.propertyType !== 'All') result = result.filter((p) => p.propertyType === filters.propertyType);
    if (filters.bhk !== 'All') result = result.filter((p) => p.bhk === filters.bhk);
    if (filters.furnished !== 'All') result = result.filter((p) => p.furnished === filters.furnished);
    result = result.filter((p) => p.rent >= filters.rentMin && p.rent <= filters.rentMax);
    result = result.filter((p) => p.distanceKm <= filters.distanceMax);

    // Sort: vacant first, then by freshness
    result.sort((a, b) => {
      if (a.status !== b.status) return a.status === 'vacant' ? -1 : 1;
      return b.lastUpdated - a.lastUpdated;
    });

    return result;
  }, [properties, search, filters]);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  const handleContact = (p: Property) => setContactProperty(p);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">Find a home near you</h1>
        <p className="mt-1 text-gray-500 text-sm">Search rentals with live availability verified by owners.</p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
      </div>

      {/* Filters */}
      <div className="mb-5">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Results count + view toggle */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {loading ? 'Searching...' : (
            <><span className="font-semibold text-navy-900">{filtered.length}</span> properties found{search && <> in <span className="font-medium text-navy-700">"{search}"</span></>}</>
          )}
        </p>
        <button
          onClick={() => setShowMap(!showMap)}
          className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white ring-1 ring-gray-200 text-navy-700"
        >
          {showMap ? <LayoutGrid size={16} /> : <MapIcon size={16} />}
          {showMap ? 'List View' : 'Map View'}
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Property cards */}
        <div className={`w-full ${showMap ? 'hidden' : 'block'} lg:block lg:w-[45%] xl:w-[42%]`}>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <PropertyCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<MapPin size={28} />}
              title="No properties found"
              description="Try adjusting your search or filters to see more results."
              action={{ label: 'Clear filters', onClick: () => { setSearch(''); setFilters(defaultFilters); } }}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={p} onContact={() => handleContact(p)} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Map panel */}
        <div className={`w-full ${showMap ? 'block' : 'hidden'} lg:block lg:w-[55%] xl:w-[58%]`}>
          <div className="sticky top-20 h-[calc(100vh-6rem)] min-h-[400px]">
            <MapView properties={filtered} selectedId={selectedMapId} onSelect={(id) => {
              setSelectedMapId(id);
              navigate('property-details', id);
            }} />
          </div>
        </div>
      </div>

      {/* Contact modal */}
      <Modal
        open={!!contactProperty}
        onClose={() => setContactProperty(null)}
        title="Contact Owner"
        size="sm"
      >
        {contactProperty && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={contactProperty.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <h4 className="font-semibold text-navy-900">{contactProperty.title}</h4>
                <p className="text-sm text-gray-500">{contactProperty.area}, {contactProperty.city}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-500">Owner</p>
              <p className="font-semibold text-navy-900">{contactProperty.ownerName}</p>
              <p className="mt-2 text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-navy-900">{contactProperty.ownerPhone}</p>
            </div>
            <button
              onClick={() => {
                showToast(`Contact details for ${contactProperty.title} shared`, 'success');
                setContactProperty(null);
              }}
              className="mt-4 w-full py-3 rounded-xl bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors"
            >
              I've contacted the owner
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
