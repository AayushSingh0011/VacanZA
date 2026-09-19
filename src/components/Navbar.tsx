import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Search, Bookmark, LayoutDashboard, Building2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Page } from '@/types';

export function Navbar() {
  const { page, navigate } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: { label: string; page: Page }[] = [
    { label: 'Home', page: 'landing' },
    { label: 'Find a Home', page: 'renter' },
    { label: 'List Property', page: 'add-property' },
    { label: 'How It Works', page: 'landing' },
    { label: 'About', page: 'landing' },
  ];

  const isActive = (p: Page) => {
    if (p === 'landing' && (page === 'landing' || page === 'property-details')) return true;
    if (p === 'renter' && page === 'renter') return true;
    if (p === 'add-property' && (page === 'add-property' || page === 'owner' || page === 'manage-property')) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigate('landing')} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-navy-900 tracking-tight">Vacanza</span>
          </button>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.page)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.page)
                    ? 'text-navy-900 bg-navy-50'
                    : 'text-gray-500 hover:text-navy-800 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => navigate('renter')}
              className="px-4 py-2 rounded-xl text-sm font-medium text-navy-800 hover:bg-gray-50 transition-colors"
            >
              I'm a Renter
            </button>
            <button
              onClick={() => navigate('owner')}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-navy-900 text-white hover:bg-navy-800 transition-colors"
            >
              I'm an Owner
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-navy-800 hover:bg-gray-50"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-gray-100 glass"
            >
              <div className="px-4 py-3 space-y-1">
                {links.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      navigate(link.page);
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-navy-700 hover:bg-gray-50"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => { navigate('renter'); setMobileOpen(false); }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-navy-800 bg-gray-50 ring-1 ring-gray-200"
                  >
                    I'm a Renter
                  </button>
                  <button
                    onClick={() => { navigate('owner'); setMobileOpen(false); }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-navy-900 text-white"
                  >
                    I'm an Owner
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
