import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Percent, ShieldCheck, Box, Layers } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PromotionManager = () => {
  const [products, setProducts] = useState([]);
  const [categories] = useState(["Electrical", "Plumbing", "Tools", "Paints", "Construction"]); 
  const [formData, setFormData] = useState({
    title: '',
    type: 'PERCENTAGE',
    value: '',
    targetType: 'PRODUCT',
    targetId: '',
    targetCategory: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/products/all")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    const loading = toast.loading("Deploying Discount Protocol...");
    try {
      const res = await fetch("http://localhost:8080/api/promotions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Promotion Authorized successfully", { id: loading });
        // Optional: window.location.reload(); to refresh the active list
      }
    } catch (err) {
      toast.error("Protocol Failure", { id: loading });
    }
  };

  return (
    <div className="p-10 bg-white/[0.02] border border-white/5 backdrop-blur-3xl relative text-left">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Percent className="text-[#D4AF37]" size={18} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Promotion Management CRUD</h3>
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter">Create <span className="text-transparent stroke-text">Discount Protocol</span></h2>
      </header>

      <form onSubmit={handleCreatePromotion} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => setFormData({...formData, targetType: 'PRODUCT'})}
            className={`py-4 border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${formData.targetType === 'PRODUCT' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 border-white/10 text-gray-500'}`}
          >
            <Box size={14} /> Specific Product
          </button>
          <button 
            type="button"
            onClick={() => setFormData({...formData, targetType: 'CATEGORY'})}
            className={`py-4 border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${formData.targetType === 'CATEGORY' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 border-white/10 text-gray-500'}`}
          >
            <Layers size={14} /> Full Category
          </button>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black block">Select Target</label>
          {formData.targetType === 'PRODUCT' ? (
            <select 
              required
              className="w-full bg-black border border-white/10 p-5 focus:border-[#D4AF37] outline-none text-xs font-bold appearance-none text-white"
              onChange={(e) => setFormData({...formData, targetId: e.target.value})}
            >
              <option value="">-- CHOOSE HARDWARE ASSET --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (LKR {p.price})</option>)}
            </select>
          ) : (
            <select 
              required
              className="w-full bg-black border border-white/10 p-5 focus:border-[#D4AF37] outline-none text-xs font-bold appearance-none text-white"
              onChange={(e) => setFormData({...formData, targetCategory: e.target.value})}
            >
              <option value="">-- CHOOSE BUSINESS CATEGORY --</option>
              {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Protocol Title</label>
              <input type="text" required placeholder="E.G. PAINT SECTION CLEARANCE" className="w-full bg-black border border-white/10 p-5 text-xs uppercase font-bold" onChange={(e) => setFormData({...formData, title: e.target.value})} />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Type</label>
                <select className="w-full bg-black border border-white/10 p-5 text-xs font-bold" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="PERCENTAGE">% OFF</option>
                  <option value="FIXED_AMOUNT">LKR OFF</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Value</label>
                <input type="number" required placeholder="10" className="w-full bg-black border border-white/10 p-5 text-xs font-mono" onChange={(e) => setFormData({...formData, value: e.target.value})} />
              </div>
           </div>
        </div>

        {/* FIXED: Added onChange handlers for dates [cite: 410, 411] */}
        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Start Date</label>
              <input type="date" required className="w-full bg-black border border-white/10 p-5 text-xs text-white" onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
           </div>
           <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">End Date</label>
              <input type="date" required className="w-full bg-black border border-white/10 p-5 text-xs text-white" onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
           </div>
        </div>

        <button className="w-full py-6 bg-[#D4AF37] text-black font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_10px_40px_rgba(212,175,55,0.1)]">
          <ShieldCheck size={18} /> Authorize Promotion Protocol
        </button>
      </form>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

export default PromotionManager;