import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, BedDouble, Bath, Car, Heart, Phone, Share2,
  CheckCircle2, Shield, Zap, Droplets, Wifi, Tv, Sofa, TreePine,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusBadge, AvailabilityIndicator } from '@/components/StatusBadge';
import { MapView } from '@/components/MapView';
import { Modal } from '@/components/Modal';
import { formatRent, formatDistance } from '@/lib/utils';

const amenityIcons: Record<string, typeof CheckCircle2> = {
  'Parking': Car,
  'Water Supply': Droplets,
  '24/7 Electricity': Zap,
  'Balcony': Shield,
  'Furnished': Sofa,
  'Lift': Zap,
  'Security': Shield,
  'Garden': TreePine,
  'Wi-Fi': Wifi,
  'Meals Available': Sofa,
  'Common TV': Tv,
  'Courtyard': TreePine,
};

export function PropertyDetailsPage() {
  const { properties, selectedPropertyId, navigate, toggleSaved, isSaved, showToast } = useApp();
  const property = properties.find((p) => p.id === selectedPropertyId);
  const [activeImage, setActiveImage] = useState(0);
  const [showContact, setShowContact] = useState(false);

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Property not found.</p>
        <button onClick={() => navigate('renter')} className="mt-4 px-4 py-2 rounded-xl bg-navy-900 text-white text-sm font-medium">
          Back to search
        </button>
      </div>
    );
  }

  const saved = isSaved(property.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate('renter')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy-800 transition-colors mb-5"
      >
        <ArrowLeft size={18} />
        Back to results
      </button>

      {/* Status banner — prominent */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-white ring-1 ring-gray-100 shadow-card"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={property.status} size="lg" showPulse={property.status === 'vacant'} />
          <AvailabilityIndicator property={property} size="md" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaved(property.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              saved ? 'bg-red-50 text-red-600 ring-1 ring-red-100' : 'bg-gray-50 text-navy-700 ring-1 ring-gray-200 hover:bg-gray-100'
            }`}
          >
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={() => showToast('Link copied to clipboard', 'success')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50 text-navy-700 ring-1 ring-gray-200 hover:bg-gray-100"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </motion.div>

      {/* Image gallery */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="col-span-4 lg:col-span-2 row-span-2 aspect-[16/10] lg:aspect-auto rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-100">
          <img src={property.images[activeImage]} alt={property.title} className="w-full h-full object-cover" />
        </div>
        {property.images.slice(1, 5).map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i + 1)}
            className="aspect-[16/10] lg:aspect-auto rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-100 hover:ring-2 hover:ring-navy-300 transition-all"
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title + rent */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">{property.title}</h1>
            <div className="mt-2 flex items-center gap-1 text-gray-500 text-sm">
              <MapPin size={15} />
              {property.area}, {property.city}, {property.state}
              <span className="text-gray-300 mx-1">•</span>
              {formatDistance(property.distanceKm)} away
            </div>
            <p className="mt-3 text-3xl font-bold text-navy-900">
              {formatRent(property.rent)}
              <span className="text-base font-normal text-gray-400">/month</span>
            </p>
            <p className="mt-1 text-sm text-gray-500">Deposit: {formatRent(property.deposit)}</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: BedDouble, label: property.bhk === 'Studio' ? 'Studio' : `${property.bhk} BHK` },
              { icon: Bath, label: `${property.bathrooms} Bathrooms` },
              { icon: Sofa, label: property.furnished },
              { icon: Car, label: property.parking ? 'Parking' : 'No Parking' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-white ring-1 ring-gray-100 text-center">
                <s.icon size={20} className="mx-auto text-navy-400" />
                <p className="mt-1.5 text-sm font-medium text-navy-800">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-navy-900 text-lg mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-navy-900 text-lg mb-3">Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((a) => {
                const Icon = amenityIcons[a] || CheckCircle2;
                return (
                  <div key={a} className="flex items-center gap-2 p-3 rounded-xl bg-white ring-1 ring-gray-100">
                    <Icon size={18} className="text-green-600 shrink-0" />
                    <span className="text-sm text-navy-700">{a}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Location map */}
          <div>
            <h3 className="font-semibold text-navy-900 text-lg mb-3">Location</h3>
            <div className="h-64 rounded-2xl overflow-hidden">
              <MapView properties={[property]} selectedId={property.id} showControls={false} />
            </div>
          </div>
        </div>

        {/* Right: owner card */}
        <div>
          <div className="sticky top-20">
            <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-semibold">
                  {property.ownerName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Listed by</p>
                  <p className="font-semibold text-navy-900">{property.ownerName}</p>
                  <p className="text-xs text-green-600 font-medium">Property Owner</p>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Availability</span>
                  <StatusBadge status={property.status} size="sm" showPulse={property.status === 'vacant'} />
                </div>
                <div className="mt-2">
                  <AvailabilityIndicator property={property} size="sm" />
                </div>
              </div>

              <button
                onClick={() => setShowContact(true)}
                className="mt-4 w-full py-3 rounded-xl bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Contact Owner
              </button>
              <button
                onClick={() => {
                  toggleSaved(property.id);
                  showToast(saved ? 'Removed from saved' : 'Property saved', 'success');
                }}
                className="mt-2 w-full py-3 rounded-xl bg-gray-50 text-navy-700 font-medium ring-1 ring-gray-200 hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Heart size={18} fill={saved ? 'currentColor' : 'none'} className={saved ? 'text-red-500' : ''} />
                {saved ? 'Saved' : 'Save Property'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact modal */}
      <Modal open={showContact} onClose={() => setShowContact(false)} title="Contact Owner" size="sm">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={property.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <h4 className="font-semibold text-navy-900">{property.title}</h4>
              <p className="text-sm text-gray-500">{property.area}, {property.city}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">Owner</p>
            <p className="font-semibold text-navy-900">{property.ownerName}</p>
            <p className="mt-2 text-sm text-gray-500">Phone</p>
            <p className="font-semibold text-navy-900">{property.ownerPhone}</p>
          </div>
          <button
            onClick={() => { showToast(`Contact details for ${property.title} shared`, 'success'); setShowContact(false); }}
            className="mt-4 w-full py-3 rounded-xl bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </Modal>
    </div>
  );
}
