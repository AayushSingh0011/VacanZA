import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/Common';
import { ToastContainer } from '@/components/Toast';
import { LandingPage } from '@/pages/LandingPage';
import { RenterDashboard } from '@/pages/RenterDashboard';
import { PropertyDetailsPage } from '@/pages/PropertyDetailsPage';
import { OwnerDashboard } from '@/pages/OwnerDashboard';
import { AddPropertyPage } from '@/pages/AddPropertyPage';
import { ManagePropertyPage } from '@/pages/ManagePropertyPage';
import { SavedPage } from '@/pages/SavedPage';

function PageRouter() {
  const { page } = useApp();

  const pages: Record<string, React.ReactNode> = {
    landing: <LandingPage />,
    renter: <RenterDashboard />,
    'property-details': <PropertyDetailsPage />,
    owner: <OwnerDashboard />,
    'add-property': <AddPropertyPage />,
    'manage-property': <ManagePropertyPage />,
    saved: <SavedPage />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={page}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="pb-20 sm:pb-0 min-h-screen"
      >
        {pages[page] || <LandingPage />}
      </motion.main>
    </AnimatePresence>
  );
}

function AppShell() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageRouter />
      <BottomNav />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
