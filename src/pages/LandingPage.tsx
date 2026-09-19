import { motion } from 'framer-motion';
import { MapPin, Radio, UserCheck, Navigation, Phone, ArrowRight, Search, Home, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { mockProperties } from '@/data/mockData';
import { timeAgo } from '@/lib/utils';

export function LandingPage() {
  const { navigate } = useApp();
  const featured = mockProperties.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium ring-1 ring-green-100 mb-6">
                <Radio size={14} className="animate-pulse" />
                Live rental vacancy discovery
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 leading-[1.05] tracking-tight">
                Find what's vacant.
                <br />
                <span className="text-navy-400">Right now.</span>{' '}
                <span className="text-green-600">Around you.</span>
              </h1>
              <p className="mt-5 text-lg text-gray-500 max-w-lg leading-relaxed">
                Discover rental homes, flats and rooms that are actually available — with live availability updates from property owners.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('renter')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/10"
                >
                  <Search size={18} />
                  Find a Home
                </button>
                <button
                  onClick={() => navigate('add-property')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-navy-800 font-medium ring-1 ring-gray-200 hover:ring-gray-300 transition-colors"
                >
                  <Plus size={18} />
                  List Your Property
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Radio, label: 'Live availability' },
                  { icon: UserCheck, label: 'Owner-listed' },
                  { icon: Navigation, label: 'Location-based' },
                  { icon: Phone, label: 'Direct contact' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon size={18} className="text-green-600 shrink-0" />
                    <span className="text-sm text-navy-600 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: map visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
            >
              <HeroMapVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">How it works</h2>
            <p className="mt-3 text-gray-500">Two simple paths — whether you're renting or listing.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Renters */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 text-navy-700 text-sm font-medium">
                  <Search size={15} /> For Renters
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { num: '01', title: 'Choose your area', desc: 'Search by locality, landmark or city to find rentals near you.', icon: MapPin },
                  { num: '02', title: 'See available properties', desc: 'Instantly see which homes are actually vacant right now.', icon: Home },
                  { num: '03', title: 'Contact the owner', desc: 'Reach out directly — no brokers, no middlemen.', icon: Phone },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-lg">
                      {step.num}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <step.icon size={18} className="text-navy-400" />
                        <h4 className="font-semibold text-navy-900">{step.title}</h4>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owners */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                  <Plus size={15} /> For Owners
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { num: '01', title: 'Add your property', desc: 'Enter basic details — title, type, rent and location.', icon: Home },
                  { num: '02', title: 'Upload photos and details', desc: 'Add images, amenities and a description.', icon: CheckCircle2 },
                  { num: '03', title: 'Update VACANT / FULL status', desc: 'Toggle availability anytime — renters see it instantly.', icon: Radio },
                ].map((step) => (
                  <div key={step.num} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                      {step.num}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <step.icon size={18} className="text-green-500" />
                        <h4 className="font-semibold text-navy-900">{step.title}</h4>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-navy-900 tracking-tight">Available right now</h2>
              <p className="mt-2 text-gray-500">Properties with freshly verified availability.</p>
            </div>
            <button
              onClick={() => navigate('renter')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-navy-800 hover:bg-gray-50 transition-colors"
            >
              Browse all
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-100 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group"
                onClick={() => navigate('property-details', p.id)}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={p.status} showPulse={p.status === 'vacant'} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-navy-900">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{p.bhk === 'Studio' ? 'Studio' : `${p.bhk} BHK`} • {p.area}, {p.city}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-navy-900">₹{p.rent.toLocaleString('en-IN')}<span className="text-sm font-normal text-gray-400">/mo</span></span>
                    <span className="text-xs text-green-600 font-medium">Verified {timeAgo(p.lastUpdated)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-navy-900 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Have a property to rent out?</h2>
              <p className="mt-3 text-navy-200 max-w-lg mx-auto">
                List it in minutes and keep availability updated. Renters find you when it matters — when it's actually vacant.
              </p>
              <button
                onClick={() => navigate('add-property')}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-navy-900 font-medium hover:bg-gray-100 transition-colors"
              >
                <Plus size={18} />
                List Your Property
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroMapVisual() {
  const markers = [
    { x: 30, y: 35, vacant: true, label: '₹8,500' },
    { x: 62, y: 25, vacant: false, label: '₹12,000' },
    { x: 45, y: 55, vacant: true, label: '₹6,500' },
    { x: 72, y: 48, vacant: true, label: '₹9,500' },
    { x: 20, y: 65, vacant: false, label: '₹15,000' },
  ];

  return (
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-gray-100 shadow-2xl shadow-navy-900/10 bg-[#eef2f0]">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <pattern id="heroGrid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#dde4e0" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="#eaf0ee" />
        <rect width="100" height="100" fill="url(#heroGrid)" />
        <path d="M 0 30 Q 30 28 50 35 T 100 40" stroke="#d4ddd8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 0 60 Q 40 55 60 62 T 100 65" stroke="#d4ddd8" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 25 0 Q 28 30 22 55 T 30 100" stroke="#d4ddd8" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 70 0 Q 68 35 75 60 T 72 100" stroke="#d4ddd8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 0 78 Q 30 73 50 80 T 100 75" stroke="#bcd4e8" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.5" />
        <circle cx="15" cy="15" r="5" fill="#d4e8d0" opacity="0.5" />
        <circle cx="85" cy="85" r="4" fill="#d4e8d0" opacity="0.5" />
      </svg>

      {markers.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="absolute"
          style={{ left: `${m.x}%`, top: `${m.y}%`, transform: 'translate(-50%, -100%)' }}
        >
          <div className="relative flex flex-col items-center">
            <div className={`relative w-7 h-7 rounded-full ring-2 ring-white shadow-md flex items-center justify-center ${m.vacant ? 'bg-green-500' : 'bg-red-500'}`}>
              <MapPin size={13} className="text-white" fill="white" />
              {m.vacant && <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />}
            </div>
            <div className={`w-2 h-2 -mt-1 rotate-45 ${m.vacant ? 'bg-green-500' : 'bg-red-500'} ring-2 ring-white`} />
          </div>
        </motion.div>
      ))}

      {/* Floating card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-60"
      >
        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-navy-900">2 BHK • ₹8,500/mo</span>
            <StatusBadge status="vacant" size="sm" showPulse />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <Radio size={12} className="animate-pulse" />
            Updated 8 min ago
          </div>
        </div>
      </motion.div>
    </div>
  );
}
