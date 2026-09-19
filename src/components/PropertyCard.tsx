import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Car, Heart, Eye, Phone } from 'lucide-react';
import type { Property } from '@/types';
import { formatRent, formatDistance } from '@/lib/utils';
import { StatusBadge, AvailabilityIndicator } from './StatusBadge';
import { useApp } from '@/context/AppContext';

interface PropertyCardProps {
  property: Property;
  onContact?: () => void;
  layout?: 'default' | 'compact';
}

export function PropertyCard({ property, onContact, layout = 'default' }: PropertyCardProps) {
  const { navigate, toggleSaved, isSaved } = useApp();
  const saved = isSaved(property.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow ring-1 ring-gray-100"
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={property.images[0]}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="absolute top-3 left-3">
          <StatusBadge status={property.status} showPulse={property.status === 'vacant'} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaved(property.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center text-navy-700 hover:text-red-500 transition-colors shadow-sm"
          aria-label={saved ? 'Unsave property' : 'Save property'}
        >
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} className={saved ? 'text-red-500' : ''} />
        </button>
        <div className="absolute bottom-3 left-3">
          <AvailabilityIndicator property={property} size="sm" />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-navy-900 text-lg leading-tight">{property.title}</h3>
          <p className="font-bold text-navy-900 whitespace-nowrap text-lg">
            {formatRent(property.rent)}
            <span className="text-sm font-normal text-gray-400">/mo</span>
          </p>
        </div>

        <div className="mt-1.5 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">{property.area}, {property.city}</span>
          <span className="text-gray-300 mx-1">•</span>
          <span className="whitespace-nowrap">{formatDistance(property.distanceKm)}</span>
        </div>

        <div className="mt-3 flex items-center gap-3 text-sm text-gray-600 flex-wrap">
          <span className="inline-flex items-center gap-1">
            <BedDouble size={15} className="text-gray-400" />
            {property.bhk === 'Studio' ? 'Studio' : `${property.bhk} BHK`}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath size={15} className="text-gray-400" />
            {property.bathrooms} Bath
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            {property.furnished}
          </span>
          {property.parking && (
            <span className="inline-flex items-center gap-1">
              <Car size={15} className="text-gray-400" />
              Parking
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => navigate('property-details', property.id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors"
          >
            <Eye size={16} />
            View Property
          </button>
          <button
            onClick={onContact}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-50 text-navy-700 text-sm font-medium hover:bg-gray-100 ring-1 ring-gray-200 transition-colors"
          >
            <Phone size={16} />
            Contact
          </button>
        </div>
      </div>
    </motion.article>
  );
}
