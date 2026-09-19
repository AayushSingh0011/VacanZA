import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Property, Page, Toast, PropertyStatus } from '@/types';
import { mockProperties } from '@/data/mockData';

interface AppState {
  page: Page;
  navigate: (page: Page, propertyId?: string) => void;
  selectedPropertyId: string | null;
  properties: Property[];
  updatePropertyStatus: (id: string, status: PropertyStatus) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  addProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>('landing');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const navigate = useCallback((p: Page, propertyId?: string) => {
    setPage(p);
    if (propertyId !== undefined) setSelectedPropertyId(propertyId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updatePropertyStatus = useCallback((id: string, status: PropertyStatus) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status, lastUpdated: Date.now() } : p
      )
    );
  }, []);

  const updateProperty = useCallback((id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, lastUpdated: Date.now() } : p
      )
    );
  }, []);

  const addProperty = useCallback((property: Property) => {
    setProperties((prev) => [property, ...prev]);
  }, []);

  const deleteProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSavedIds((prev) => prev.filter((sid) => sid !== id));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  }, []);

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  );

  return (
    <AppContext.Provider
      value={{
        page,
        navigate,
        selectedPropertyId,
        properties,
        updatePropertyStatus,
        updateProperty,
        addProperty,
        deleteProperty,
        savedIds,
        toggleSaved,
        isSaved,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
