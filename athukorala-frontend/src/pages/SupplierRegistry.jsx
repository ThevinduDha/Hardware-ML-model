import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SupplierContactCard from '../components/SupplierContactCard';
import ProductSupplierLinkPanel from '../components/ProductSupplierLinkPanel';

const SupplierRegistry = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    category: 'GENERAL'
  });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/suppliers');
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('SUPPLIER DATABASE OFFLINE');
      setSuppliers([]);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const validate = () => {
    const phoneRegex = /^(?:0|94|\+94)?7(0|1|2|4|5|6|7|8)\d{7}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (formData.name.trim().length < 3) return 'COMPANY NAME TOO SHORT';
    if (!emailRegex.test(formData.email)) return 'INVALID EMAIL';
    if (!phoneRegex.test(formData.phoneNumber)) return 'INVALID PHONE NUMBER';

    return null;
  };

  const handleAction = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    const loading = toast.loading(editingId ? 'Updating...' : 'Registering...');

    const url = editingId
      ? `http://localhost:8080/api/suppliers/${editingId}`
      : 'http://localhost:8080/api/suppliers';

    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingId ? 'Updated' : 'Registered', { id: loading });
        closeForm();
        fetchSuppliers();
      } else {
        toast.error('Action Failed', { id: loading });
      }
    } catch {
      toast.error('Action Failed', { id: loading });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    const loading = toast.loading('Deleting...');

    try {
      const res = await fetch(`http://localhost:8080/api/suppliers/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Deleted', { id: loading });
        fetchSuppliers();
      } else {
        toast.error('Delete Failed', { id: loading });
      }
    } catch {
      toast.error('Delete Failed', { id: loading });
    }
  };

  const openEdit = (supplier) => {
    setFormData({
      name: supplier.name || '',
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phoneNumber: supplier.phoneNumber || '',
      category: supplier.category || 'GENERAL'
    });
    setEditingId(supplier.id);
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowAdd(false);
    setEditingId(null);
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phoneNumber: '',
      category: 'GENERAL'
    });
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
              Vendor Control
            </p>
            <h2 className="text-3xl font-black text-white">
              Supplier Registry
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* SEARCH INPUT WITH ICON */}
            <div className="relative w-full md:w-[280px]">
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37] placeholder-gray-500 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/20 transition whitespace-nowrap"
              >
                {showAdd ? <X size={16} /> : <Plus size={16} />}
                {showAdd ? 'Close Form' : 'Add Supplier'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FORM */}
      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={handleAction}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
          >
            <InputBox
              label="Company Name"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
            />
            <InputBox
              label="Contact Person"
              value={formData.contactPerson}
              onChange={(v) => setFormData({ ...formData, contactPerson: v })}
            />
            <InputBox
              label="Email"
              type="email"
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
            />
            <InputBox
              label="Phone"
              value={formData.phoneNumber}
              onChange={(v) => setFormData({ ...formData, phoneNumber: v })}
            />

            <select
              className="bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#D4AF37] outline-none transition-all"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>GENERAL</option>
              <option>PAINTS</option>
              <option>TOOLS</option>
              <option>ELECTRICAL</option>
            </select>

            <button
              type="submit"
              className="bg-[#D4AF37] text-black rounded-xl font-bold py-4 hover:bg-white transition"
            >
              {editingId ? 'Update Supplier' : 'Add Supplier'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* SUPPLIERS GRID WITH SEARCH FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Array.isArray(suppliers) ? suppliers : [])
          .filter((s) => {
            const term = searchTerm.toLowerCase();

            return (
              s.name?.toLowerCase().includes(term) ||
              s.contactPerson?.toLowerCase().includes(term) ||
              s.email?.toLowerCase().includes(term) ||
              s.phoneNumber?.includes(term)
            );
          })
          .map((s) => (
            <SupplierContactCard
              key={s.id}
              supplier={s}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
      </div>

      {/* EMPTY STATE */}
      {Array.isArray(suppliers) && suppliers.length > 0 && 
        suppliers.filter((s) => {
          const term = searchTerm.toLowerCase();
          return (
            s.name?.toLowerCase().includes(term) ||
            s.contactPerson?.toLowerCase().includes(term) ||
            s.email?.toLowerCase().includes(term) ||
            s.phoneNumber?.includes(term)
          );
        }).length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Search className="text-[#D4AF37]" size={28} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No suppliers found</h3>
          <p className="text-gray-400">
            No suppliers match your search term "{searchTerm}"
          </p>
        </div>
      )}

      {/* EMPTY DATABASE STATE */}
      {(!Array.isArray(suppliers) || suppliers.length === 0) && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Plus className="text-[#D4AF37]" size={28} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No suppliers registered</h3>
          <p className="text-gray-400">
            {isAdmin ? 'Click "Add Supplier" to register your first vendor' : 'Check back later for new suppliers'}
          </p>
        </div>
      )}

      {/* PRODUCT ↔ SUPPLIER LINK PANEL */}
      <ProductSupplierLinkPanel />
    </div>
  );
};

const InputBox = ({ label, value, onChange, type = 'text' }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-gray-400 uppercase tracking-wider">{label}</label>
    <input
      required
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#D4AF37] outline-none transition-all"
    />
  </div>
);

export default SupplierRegistry;