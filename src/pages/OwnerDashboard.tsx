import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, XCircle, Plus, Home } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { OwnerPropertyCard } from '@/components/OwnerPropertyCard';
import { StatCard, EmptyState } from '@/components/Common';
import { Modal } from '@/components/Modal';
import { timeAgo } from '@/lib/utils';
import type { Property, PropertyStatus } from '@/types';

export function OwnerDashboard() {
  const { properties, updatePropertyStatus, deleteProperty, navigate, showToast } = useApp();
  const [statusModal, setStatusModal] = useState<{ property: Property; newStatus: PropertyStatus } | null>(null);
  const [deleteModal, setDeleteModal] = useState<Property | null>(null);

  const stats = useMemo(() => {
    const vacant = properties.filter((p) => p.status === 'vacant').length;
    const full = properties.filter((p) => p.status === 'full').length;
    return { total: properties.length, vacant, full };
  }, [properties]);

  const handleConfirmStatus = () => {
    if (!statusModal) return;
    updatePropertyStatus(statusModal.property.id, statusModal.newStatus);
    showToast(
      `${statusModal.property.title} marked as ${statusModal.newStatus === 'vacant' ? 'VACANT' : 'FULL'}`,
      statusModal.newStatus === 'vacant' ? 'success' : 'info'
    );
    setStatusModal(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteModal) return;
    deleteProperty(deleteModal.id);
    showToast(`${deleteModal.title} deleted`, 'info');
    setDeleteModal(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">Owner Dashboard</h1>
          <p className="mt-1 text-gray-500 text-sm">Manage your properties and keep availability up to date.</p>
        </div>
        <button
          onClick={() => navigate('add-property')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors"
        >
          <Plus size={18} />
          Add Property
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <StatCard label="Total Properties" value={stats.total} icon={<Building2 size={20} className="text-navy-600" />} color="bg-navy-50" />
        <StatCard label="Vacant" value={stats.vacant} icon={<CheckCircle2 size={20} className="text-green-600" />} color="bg-green-50" />
        <StatCard label="Full" value={stats.full} icon={<XCircle size={20} className="text-red-600" />} color="bg-red-50" />
      </div>

      {/* Property list */}
      {properties.length === 0 ? (
        <EmptyState
          icon={<Home size={28} />}
          title="No properties yet"
          description="Add your first property to start receiving renter enquiries."
          action={{ label: 'Add Property', onClick: () => navigate('add-property') }}
        />
      ) : (
        <div className="space-y-4">
          {properties.map((p) => (
            <OwnerPropertyCard
              key={p.id}
              property={p}
              onEdit={() => navigate('manage-property', p.id)}
              onStatusChange={() => setStatusModal({ property: p, newStatus: p.status === 'vacant' ? 'full' : 'vacant' })}
              onDelete={() => setDeleteModal(p)}
            />
          ))}
        </div>
      )}

      {/* Status change modal */}
      <Modal
        open={!!statusModal}
        onClose={() => setStatusModal(null)}
        title={statusModal?.newStatus === 'full' ? 'Mark this property as FULL?' : 'Mark this property as VACANT?'}
        size="sm"
        footer={
          <>
            <button onClick={() => setStatusModal(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button
              onClick={handleConfirmStatus}
              className={`px-4 py-2 rounded-xl text-sm font-medium text-white ${
                statusModal?.newStatus === 'full' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Confirm
            </button>
          </>
        }
      >
        {statusModal && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={statusModal.property.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-navy-900">{statusModal.property.title}</p>
                <p className="text-sm text-gray-500">Last updated {timeAgo(statusModal.property.lastUpdated)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {statusModal.newStatus === 'full'
                ? 'This will remove it from active vacant-property results. Renters will no longer see it as available.'
                : 'This will make the property visible in vacant-property results. Renters will see it as available now.'}
            </p>
          </div>
        )}
      </Modal>

      {/* Delete modal */}
      <Modal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete this property?"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteModal(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
            <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700">
              Delete
            </button>
          </>
        }
      >
        {deleteModal && (
          <p className="text-sm text-gray-600">
            Are you sure you want to permanently delete <span className="font-semibold text-navy-900">{deleteModal.title}</span>? This action cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
