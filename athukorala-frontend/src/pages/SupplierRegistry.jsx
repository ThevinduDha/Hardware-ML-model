import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Mail, Plus, Trash2, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SupplierRegistry = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: '', contactPerson: '', email: '', phoneNumber: '', category: 'GENERAL' });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/suppliers/all");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      toast.error("SUPPLIER DATABASE OFFLINE");
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const loading = toast.loading("Registering Vendor...");
    try {
      const res = await fetch("http://localhost:8080/api/suppliers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier)
      });
      if (res.ok) {
        toast.success("Vendor Successfully Registered", { id: loading });
        setShowAdd(false);
        fetchSuppliers();
      }
    } catch (err) {
      toast.error("Registry Failure", { id: loading });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 font-sans">
      <header className="mb-16 flex justify-between items-end">
        <div>
          <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase mb-4">Procurement Management</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter">Supplier <span className="text-transparent stroke-text">Registry</span></h1>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-[#D4AF37] text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#E5C158] transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Register New Vendor
        </button>
      </header>

      {/* ADD SUPPLIER FORM */}
      {showAdd && (
        <motion.form 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAdd}
          className="mb-12 p-8 bg-white/[0.02] border border-[#D4AF37]/30 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <input required placeholder="COMPANY NAME" className="bg-black border border-white/10 p-4 text-[10px] font-bold tracking-widest outline-none focus:border-[#D4AF37]" onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} />
          <input required placeholder="CONTACT PERSON" className="bg-black border border-white/10 p-4 text-[10px] font-bold tracking-widest outline-none focus:border-[#D4AF37]" onChange={e => setNewSupplier({...newSupplier, contactPerson: e.target.value})} />
          <input required type="email" placeholder="EMAIL ADDRESS" className="bg-black border border-white/10 p-4 text-[10px] font-bold tracking-widest outline-none focus:border-[#D4AF37]" onChange={e => setNewSupplier({...newSupplier, email: e.target.value})} />
          <input required placeholder="PHONE NUMBER" className="bg-black border border-white/10 p-4 text-[10px] font-bold tracking-widest outline-none focus:border-[#D4AF37]" onChange={e => setNewSupplier({...newSupplier, phoneNumber: e.target.value})} />
          <select className="bg-black border border-white/10 p-4 text-[10px] font-bold tracking-widest outline-none focus:border-[#D4AF37]" onChange={e => setNewSupplier({...newSupplier, category: e.target.value})}>
            <option value="GENERAL">GENERAL</option>
            <option value="PAINTS">PAINTS</option>
            <option value="TOOLS">TOOLS</option>
            <option value="ELECTRICAL">ELECTRICAL</option>
          </select>
          <button type="submit" className="bg-white text-black font-black text-[10px] tracking-widest uppercase hover:bg-[#D4AF37] transition-all">Authorize Registration</button>
        </motion.form>
      )}

      {/* SUPPLIER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white/[0.01] border border-white/5 p-8 relative group hover:border-[#D4AF37]/20 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/[0.03] text-[#D4AF37]"><Briefcase size={20} /></div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest">{s.name}</h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{s.category}</p>
              </div>
            </div>
            
            <div className="space-y-4 border-t border-white/5 pt-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Users size={14} className="text-gray-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{s.contactPerson}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={14} className="text-gray-600" />
                <span className="text-[10px] font-mono tracking-tighter">{s.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={14} className="text-gray-600" />
                <span className="text-[10px] font-mono tracking-tighter">{s.phoneNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

export default SupplierRegistry;