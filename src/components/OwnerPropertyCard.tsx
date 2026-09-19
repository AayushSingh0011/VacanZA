import { motion } from 'framer-motion';
import { Pencil, Eye, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import type { Property } from '@/types';
import { formatRent, timeAgo } from '@/lib/utils';
import { StatusBadge, AvailabilityIndicator } from './StatusBadge';
import { useApp } from '@/context/AppContext';

interface OwnerPropertyCardProps {
  property: Property;
  onEdit: () => void;
  onStatusChange: () => void;
  onDelete: () => void;
}

export function OwnerPropertyCard({ property, onEdit, onStatusChange, onDelete }: OwnerPropertyCardProps) {
  const { navigate } = useApp();
  const isVacant = property.status === 'vacant';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-card ring-1 ring-gray-100"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 shrink-0 aspect-[16/10] sm:aspect-auto overflow-hidden bg-gray-100">
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-navy-900 text-lg">{property.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {property.bhk === 'Studio' ? 'Studio' : `${property.bhk} BHK`} • {property.propertyType} • {property.area}, {property.city}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={property.status} showPulse={property.status === 'vacant'} />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-navy-900 text-lg">
              {formatRent(property.rent)}
              <span className="text-sm font-normal text-gray-400">/mo</span>
            </span>
            <AvailabilityIndicator property={property} size="sm" />
          </div>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {isVacant ? (
              <button
                onClick={onStatusChange}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 ring-1 ring-red-200 transition-colors"
              >
                <XCircle size={16} />
                Mark Full
              </button>
            ) : (
              <button
                onClick={onStatusChange}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 ring-1 ring-green-200 transition-colors"
              >
                <CheckCircle2 size={16} />
                Mark Vacant
              </button>
            )}
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 text-navy-700 text-sm font-medium hover:bg-gray-100 ring-1 ring-gray-200 transition-colors"
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              onClick={() => navigate('property-details', property.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 text-navy-700 text-sm font-medium hover:bg-gray-100 ring-1 ring-gray-200 transition-colors"
            >
              <Eye size={16} />
              View
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 text-red-500 text-sm font-medium hover:bg-red-50 ring-1 ring-gray-200 transition-colors ml-auto"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
