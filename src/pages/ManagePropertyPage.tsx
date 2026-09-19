import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Save, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusBadge, AvailabilityIndicator } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { timeAgo, formatRent } from '@/lib/utils';
import type { PropertyType, BHK, FurnishedType, PropertyStatus } from '@/types';

const propertyTypes: PropertyType[] = ['House', 'Apartment', 'Flat', 'Room', 'PG'];
const bhkOptions: BHK[] = ['Studio', '1', '2', '3', '4+'];
const furnishedOptions: FurnishedType[] = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
const allAmenities = ['Parking', 'Water Supply', '24/7 Electricity', 'Balcony', 'Lift', 'Security', 'Garden', 'Wi-Fi', 'Meals Available', 'Common TV', 'Courtyard'];

export function ManagePropertyPage() {
  const { properties, selectedPropertyId, updateProperty, updatePropertyStatus, deleteProperty, navigate, showToast } = useApp();
  const property = properties.find((p) => p.id === selectedPropertyId);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Local form state
  const [title, setTitle] = useState(property?.title || '');
  const [propertyType, setPropertyType] = useState<PropertyType>(property?.propertyType || 'Apartment');
  const [bhk, setBhk] = useState<BHK>(property?.bhk || '2');
  const [rent, setRent] = useState(property?.rent || 8000);
  const [deposit, setDeposit] = useState(property?.deposit || 16000);
  const [area, setArea] = useState(property?.area || '');
  const [city, setCity] = useState(property?.city || '');
  const [state, setState] = useState(property?.state || '');
  const [description, setDescription] = useState(property?.description || '');
  const [amenities, setAmenities] = useState<string[]>(property?.amenities || []);
  const [furnished, setFurnished] = useState<FurnishedType>(property?.furnished || 'Furnished');
  const [bathrooms, setBathrooms] = useState(property?.bathrooms || 2);
  const [parking, setParking] = useState(property?.parking ?? true);

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Property not found.</p>
        <button onClick={() => navigate('owner')} className="mt-4 px-4 py-2 rounded-xl bg-navy-900 text-white text-sm font-medium">Back to dashboard</button>
      </div>
    );
  }

  const handleSave = () => {
    updateProperty(property.id, {
      title: title.trim() || property.title,
      propertyType,
      bhk,
      rent,
      deposit,
      area: area.trim() || property.area,
      city,
      state,
      description: description.trim() || property.description,
      amenities,
      furnished,
      bathrooms,
      parking,
    });
    showToast('Property updated successfully', 'success');
    navigate('owner');
  };

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const newStatus: PropertyStatus = property.status === 'vacant' ? 'full' : 'vacant';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <button onClick={() => navigate('owner')} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy-800 mb-5">
        <ArrowLeft size={18} /> Back to dashboard
      </button>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">Manage Property</h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <StatusBadge status={property.status} showPulse={property.status === 'vacant'} />
            <AvailabilityIndicator property={property} size="sm" />
          </div>
        </div>
        <button
          onClick={() => setShowStatusModal(true)}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            property.status === 'vacant'
              ? 'bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100'
              : 'bg-green-50 text-green-700 ring-1 ring-green-200 hover:bg-green-100'
          }`}
        >
          {property.status === 'vacant' ? 'Mark Full' : 'Mark Vacant'}
        </button>
      </div>

      {/* Image */}
      <div className="mb-6 grid grid-cols-4 gap-2">
        <div className="col-span-4 sm:col-span-2 row-span-2 aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-100">
          <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
        </div>
        {property.images.slice(1, 5).map((img, i) => (
          <div key={i} className="aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-100">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-card p-5 sm:p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1.5">Property title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Property type</label>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value as PropertyType)} className="input">
              {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">BHK</label>
            <select value={bhk} onChange={(e) => setBhk(e.target.value as BHK)} className="input">
              {bhkOptions.map((b) => <option key={b} value={b}>{b === 'Studio' ? 'Studio' : `${b} BHK`}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Monthly rent (₹)</label>
            <input type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Security deposit (₹)</label>
            <input type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="input" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Area</label>
            <input value={area} onChange={(e) => setArea(e.target.value)} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">State</label>
            <input value={state} onChange={(e) => setState(e.target.value)} className="input" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Bathrooms</label>
            <input type="number" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} className="input" min={0} />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">Furnishing</label>
            <select value={furnished} onChange={(e) => setFurnished(e.target.value as FurnishedType)} className="input">
              {furnishedOptions.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1.5">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">Amenities</label>
          <div className="flex gap-2 flex-wrap">
            {allAmenities.map((a) => (
              <button
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  amenities.includes(a) ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-gray-50 text-navy-600 ring-1 ring-gray-200'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1.5">Parking</label>
          <div className="flex gap-2">
            <button onClick={() => setParking(true)} className={`px-4 py-2 rounded-xl text-sm font-medium ${parking ? 'bg-navy-900 text-white' : 'bg-gray-50 text-navy-600 ring-1 ring-gray-200'}`}>Available</button>
            <button onClick={() => setParking(false)} className={`px-4 py-2 rounded-xl text-sm font-medium ${!parking ? 'bg-navy-900 text-white' : 'bg-gray-50 text-navy-600 ring-1 ring-gray-200'}`}>Not available</button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors">
          <Save size={18} /> Save Changes
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-red-50 text-red-600 font-medium ring-1 ring-red-200 hover:bg-red-100 transition-colors"
        >
          <Trash2 size={18} /> Delete Listing
        </button>
      </div>

      {/* Status modal */}
      <Modal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={newStatus === 'full' ? 'Mark this property as FULL?' : 'Mark this property as VACANT?'}
        size="sm"
        footer={
          <>
            <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
            <button
              onClick={() => {
                updatePropertyStatus(property.id, newStatus);
                showToast(`${property.title} marked as ${newStatus === 'vacant' ? 'VACANT' : 'FULL'}`, newStatus === 'vacant' ? 'success' : 'info');
                setShowStatusModal(false);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium text-white ${newStatus === 'full' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              Confirm
            </button>
          </>
        }
      >
        <div className="flex items-center gap-3 mb-3">
          <img src={property.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
          <div>
            <p className="font-semibold text-navy-900">{property.title}</p>
            <p className="text-sm text-gray-500">Last updated {timeAgo(property.lastUpdated)}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {newStatus === 'full'
            ? 'This will remove it from active vacant-property results. Renters will no longer see it as available.'
            : 'This will make the property visible in vacant-property results.'}
        </p>
      </Modal>

      {/* Delete modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete this property?"
        size="sm"
        footer={
          <>
            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
            <button
              onClick={() => {
                deleteProperty(property.id);
                showToast(`${property.title} deleted`, 'info');
                navigate('owner');
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to permanently delete <span className="font-semibold text-navy-900">{property.title}</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
