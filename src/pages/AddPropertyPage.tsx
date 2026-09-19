import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Check, MapPin, Home, Building, DoorOpen, BedSingle, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { formatRent } from '@/lib/utils';
import type { Property, PropertyType, BHK, FurnishedType, PropertyStatus } from '@/types';

const propertyTypes: { value: PropertyType; icon: typeof Home }[] = [
  { value: 'House', icon: Home },
  { value: 'Apartment', icon: Building },
  { value: 'Flat', icon: Building },
  { value: 'Room', icon: DoorOpen },
  { value: 'PG', icon: BedSingle },
];
const bhkOptions: BHK[] = ['Studio', '1', '2', '3', '4+'];
const furnishedOptions: FurnishedType[] = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
const allAmenities = ['Parking', 'Water Supply', '24/7 Electricity', 'Balcony', 'Lift', 'Security', 'Garden', 'Wi-Fi', 'Meals Available', 'Common TV', 'Courtyard'];

export function AddPropertyPage() {
  const { addProperty, navigate, showToast } = useApp();
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [bhk, setBhk] = useState<BHK>('2');
  const [rent, setRent] = useState(8000);
  const [deposit, setDeposit] = useState(16000);
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Haldia');
  const [state, setState] = useState('West Bengal');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>(['Parking', 'Water Supply', '24/7 Electricity']);
  const [furnished, setFurnished] = useState<FurnishedType>('Furnished');
  const [bathrooms, setBathrooms] = useState(2);
  const [parking, setParking] = useState(true);
  const [status, setStatus] = useState<PropertyStatus>('vacant');

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const handlePublish = () => {
    if (!title.trim() || !area.trim()) {
      showToast('Please fill in the title and area', 'warning');
      return;
    }
    const newProperty: Property = {
      id: `p${Date.now()}`,
      title: title.trim(),
      propertyType,
      bhk,
      rent,
      deposit,
      area: area.trim(),
      city,
      state,
      images: photos.length > 0 ? photos : [
        'https://images.pexels.com/photos/11631278/pexels-photo-11631278.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        'https://images.pexels.com/photos/7587828/pexels-photo-7587828.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      ],
      description: description.trim() || 'A great property available for rent. Contact owner for more details.',
      amenities,
      status,
      lastUpdated: Date.now(),
      ownerName: 'You',
      ownerPhone: '+91 98300 00000',
      furnished,
      bathrooms,
      parking,
      coordinates: { x: 40 + Math.random() * 30, y: 30 + Math.random() * 30 },
      distanceKm: Math.round(Math.random() * 10 * 10) / 10,
    };
    addProperty(newProperty);
    showToast(`${newProperty.title} published successfully`, 'success');
    navigate('owner');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight mb-1">List your property</h1>
      <p className="text-gray-500 text-sm mb-6">Fill in the details below to publish your rental listing.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          <FormSection title="Property Photos">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-navy-300 transition-colors cursor-pointer">
              <UploadCloud size={36} className="mx-auto text-gray-300" />
              <p className="mt-3 font-medium text-navy-800">Upload property photos</p>
              <p className="text-sm text-gray-400">JPG, PNG up to 5MB — drag and drop or click to browse</p>
              <button
                onClick={() => setPhotos((prev) => [...prev, 'https://images.pexels.com/photos/14998334/pexels-photo-14998334.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'])}
                className="mt-4 px-4 py-2 rounded-xl bg-gray-50 text-navy-700 text-sm font-medium ring-1 ring-gray-200 hover:bg-gray-100"
              >
                Add sample photo
              </button>
            </div>
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {photos.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-gray-100">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormSection>

          {/* Details */}
          <FormSection title="Property Details">
            <div className="space-y-4">
              <Field label="Property title">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Green Residency 2BHK"
                  className="input"
                />
              </Field>

              <Field label="Property type">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {propertyTypes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setPropertyType(t.value)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-medium transition-all ${
                        propertyType === t.value
                          ? 'bg-navy-900 text-white'
                          : 'bg-gray-50 text-navy-600 ring-1 ring-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <t.icon size={18} />
                      {t.value}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="BHK">
                <div className="flex gap-2 flex-wrap">
                  {bhkOptions.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBhk(b)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        bhk === b ? 'bg-navy-900 text-white' : 'bg-gray-50 text-navy-600 ring-1 ring-gray-200'
                      }`}
                    >
                      {b === 'Studio' ? 'Studio' : `${b} BHK`}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Monthly rent (₹)">
                  <input type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))} className="input" />
                </Field>
                <Field label="Security deposit (₹)">
                  <input type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className="input" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Bathrooms">
                  <input type="number" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} className="input" min={0} />
                </Field>
                <Field label="Furnishing">
                  <select value={furnished} onChange={(e) => setFurnished(e.target.value as FurnishedType)} className="input">
                    {furnishedOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Parking">
                <div className="flex gap-2">
                  <button onClick={() => setParking(true)} className={`px-4 py-2 rounded-xl text-sm font-medium ${parking ? 'bg-navy-900 text-white' : 'bg-gray-50 text-navy-600 ring-1 ring-gray-200'}`}>Available</button>
                  <button onClick={() => setParking(false)} className={`px-4 py-2 rounded-xl text-sm font-medium ${!parking ? 'bg-navy-900 text-white' : 'bg-gray-50 text-navy-600 ring-1 ring-gray-200'}`}>Not available</button>
                </div>
              </Field>

              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe your property — location highlights, nearby landmarks, what makes it special..."
                  className="input resize-none"
                />
              </Field>

              <Field label="Amenities">
                <div className="flex gap-2 flex-wrap">
                  {allAmenities.map((a) => (
                    <button
                      key={a}
                      onClick={() => toggleAmenity(a)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        amenities.includes(a) ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-gray-50 text-navy-600 ring-1 ring-gray-200'
                      }`}
                    >
                      {amenities.includes(a) && <Check size={14} />}
                      {a}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </FormSection>

          {/* Location */}
          <FormSection title="Location">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Area">
                <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Central Haldia" className="input" />
              </Field>
              <Field label="City">
                <input value={city} onChange={(e) => setCity(e.target.value)} className="input" />
              </Field>
              <Field label="State">
                <input value={state} onChange={(e) => setState(e.target.value)} className="input" />
              </Field>
            </div>
            <div className="mt-4 h-48 rounded-2xl bg-[#eef2f0] ring-1 ring-gray-100 flex items-center justify-center relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs><pattern id="locGrid" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M 6 0 L 0 0 0 6" fill="none" stroke="#dde4e0" strokeWidth="0.2" /></pattern></defs>
                <rect width="100" height="100" fill="#eaf0ee" />
                <rect width="100" height="100" fill="url(#locGrid)" />
                <path d="M 0 50 Q 30 48 50 55 T 100 52" stroke="#d4ddd8" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <div className="relative text-center">
                <MapPin size={28} className="mx-auto text-navy-400" />
                <p className="mt-1 text-sm text-gray-400">Map location picker (mock)</p>
              </div>
            </div>
          </FormSection>

          {/* Availability */}
          <FormSection title="Availability">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStatus('vacant')}
                className={`p-5 rounded-2xl text-left transition-all ${
                  status === 'vacant' ? 'bg-green-50 ring-2 ring-green-300' : 'bg-gray-50 ring-1 ring-gray-200'
                }`}
              >
                <StatusBadge status="vacant" showPulse />
                <p className="mt-2 font-semibold text-navy-900">Available for rent now</p>
                <p className="text-sm text-gray-500">Renters will see this in vacant results.</p>
              </button>
              <button
                onClick={() => setStatus('full')}
                className={`p-5 rounded-2xl text-left transition-all ${
                  status === 'full' ? 'bg-red-50 ring-2 ring-red-300' : 'bg-gray-50 ring-1 ring-gray-200'
                }`}
              >
                <StatusBadge status="full" />
                <p className="mt-2 font-semibold text-navy-900">Currently occupied</p>
                <p className="text-sm text-gray-500">Hidden from vacant results.</p>
              </button>
            </div>
          </FormSection>

          <button
            onClick={handlePublish}
            className="w-full py-3.5 rounded-xl bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors"
          >
            Publish Property
          </button>
        </div>

        {/* Preview card */}
        <div>
          <div className="sticky top-20">
            <p className="text-sm font-medium text-gray-400 mb-3">Live preview</p>
            <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-100 shadow-card">
              <div className="relative aspect-[16/10] bg-gray-100">
                {photos[0] ? (
                  <img src={photos[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <Home size={32} />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <StatusBadge status={status} showPulse={status === 'vacant'} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-navy-900 text-lg">{title || 'Property title'}</h3>
                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                  <MapPin size={14} />
                  {area || 'Area'}, {city}
                </p>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                  <span>{bhk === 'Studio' ? 'Studio' : `${bhk} BHK`}</span>
                  <span>•</span>
                  <span>{furnished}</span>
                </div>
                <p className="mt-3 text-2xl font-bold text-navy-900">{formatRent(rent)}<span className="text-sm font-normal text-gray-400">/mo</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-card p-5 sm:p-6">
      <h3 className="font-semibold text-navy-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
