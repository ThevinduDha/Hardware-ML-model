import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Percent,
  ShieldCheck,
  Box,
  Layers,
  Calendar,
  Zap,
  RefreshCcw,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.07 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: 'easeOut' }
  }
};

const PromotionManager = ({ onSuccess, preSelected, editingItem, onCancelEdit }) => {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [categories] = useState(["Electrical", "Plumbing", "Tools", "Paints", "Construction"]);
  const today = new Date().toISOString().split('T')[0];

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
    if (preSelected) {
      setFormData(prev => ({
        ...prev,
        targetType: 'PRODUCT',
        targetId: preSelected.id.toString(),
        title: `${preSelected.name.toUpperCase()} PROMO`
      }));
    }
  }, [preSelected]);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        type: editingItem.type,
        value: editingItem.value,
        targetType: editingItem.targetType,
        targetId: editingItem.targetId ? editingItem.targetId.toString() : '',
        targetCategory: editingItem.targetCategory || '',
        startDate: editingItem.startDate,
        endDate: editingItem.endDate
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingItem]);

  useEffect(() => {
    fetchProducts();
    fetchPromotions();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products/all");
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchPromotions = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/promotions/all");
      const data = await res.json();
      setPromotions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch promotions", err);
      setPromotions([]);
    }
  };

  const generatePromotionReport = () => {
    const doc = new jsPDF();

    // HEADER
    doc.setFontSize(20);
    doc.text("ATHUKORALA TRADERS", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("Promotion Intelligence Report", 105, 28, { align: "center" });

    const now = new Date();
    doc.text(`Generated: ${now.toLocaleString()}`, 14, 40);

    // TABLE DATA
    const tableData = (Array.isArray(promotions) ? promotions : []).map((p) => {
      const status = new Date(p.endDate) < new Date() ? "Expired" : "Active";

      return [
        p.title,
        p.type === "PERCENTAGE" ? `${p.value}%` : `LKR ${p.value}`,
        p.targetType === "PRODUCT"
          ? `Product #${p.targetId}`
          : p.targetCategory,
        p.startDate,
        p.endDate,
        status
      ];
    });

    // TABLE
    autoTable(doc, {
      startY: 50,
      head: [["Title", "Discount", "Target", "Start", "End", "Status"]],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [212, 175, 55],
        textColor: 0
      },
      alternateRowStyles: {
        fillColor: [20, 20, 20]
      }
    });

    doc.save("promotion_report.pdf");
    toast.success("Report exported successfully!");
  };

  const handleProcessProtocol = async (e) => {
    e.preventDefault();

    if (formData.type === 'PERCENTAGE' && parseFloat(formData.value) > 100) {
      return toast.error("VALIDATION ERROR: REDUCTION CANNOT EXCEED 100%");
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return toast.error("DATE ERROR: TERMINATION MUST BE AFTER ACTIVATION");
    }

    const payload = {
      ...formData,
      targetId: formData.targetId ? parseInt(formData.targetId) : null,
      value: parseFloat(formData.value),
      enabled: true
    };

    const isUpdate = !!editingItem;
    const url = isUpdate
      ? `http://localhost:8080/api/promotions/update/${editingItem.id}`
      : "http://localhost:8080/api/promotions/create";

    const method = isUpdate ? "PUT" : "POST";
    const loading = toast.loading(
      isUpdate ? "Updating Protocol..." : "Deploying Discount Protocol..."
    );

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          isUpdate
            ? "Protocol Modifications Committed"
            : "Promotion Authorized Successfully",
          { id: loading }
        );

        setFormData({
          title: '',
          type: 'PERCENTAGE',
          value: '',
          targetType: 'PRODUCT',
          targetId: '',
          targetCategory: '',
          startDate: '',
          endDate: ''
        });

        if (onSuccess) onSuccess();
        fetchPromotions(); // Refresh the list
      } else {
        const errorText = await res.text();
        console.error("Registry Rejection Details:", errorText);
        toast.error("Protocol Refused: Data Mismatch", { id: loading });
      }
    } catch (err) {
      toast.error("System Link Offline: Gateway Timeout", { id: loading });
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* MAIN FORM PANEL ONLY */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] backdrop-blur-2xl p-6 lg:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.28)]"
      >
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${editingItem ? 'via-blue-500' : 'via-[#D4AF37]/50'} to-transparent`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_34%)] pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-8 flex flex-col lg:flex-row justify-between items-start gap-5">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                    editingItem
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                      : 'bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37]'
                  }`}
                >
                  {editingItem ? (
                    <RefreshCcw size={18} className="animate-spin-slow" />
                  ) : (
                    <Percent size={18} />
                  )}
                </div>

                <h3
                  className={`text-[10px] font-black uppercase tracking-[0.5em] ${
                    editingItem ? 'text-blue-400' : 'text-[#D4AF37]'
                  }`}
                >
                  {editingItem ? 'Modification Mode' : 'Management CRUD'}
                </h3>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none text-white">
                {editingItem ? 'Update' : 'Create'}{' '}
                <span className="text-transparent stroke-text">
                  Discount Protocol
                </span>
              </h2>
            </div>

            {editingItem && (
              <button
                onClick={onCancelEdit}
                type="button"
                className="p-3 text-gray-500 hover:text-white border border-white/10 rounded-2xl group transition-all bg-white/[0.03] hover:bg-white/[0.06]"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform" />
              </button>
            )}
          </div>

          <form onSubmit={handleProcessProtocol} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TargetButton
                active={formData.targetType === 'PRODUCT'}
                onClick={() => setFormData({ ...formData, targetType: 'PRODUCT' })}
                icon={<Box size={14} />}
                label="Specific Product"
              />
              <TargetButton
                active={formData.targetType === 'CATEGORY'}
                onClick={() => setFormData({ ...formData, targetType: 'CATEGORY' })}
                icon={<Layers size={14} />}
                label="Full Category"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">
                Deployment Target
              </label>

              <div className="relative group">
                <select
                  required
                  value={
                    formData.targetType === 'PRODUCT'
                      ? formData.targetId
                      : formData.targetCategory
                  }
                  className="w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 focus:border-[#D4AF37] outline-none text-sm font-semibold appearance-none text-white transition-all"
                  onChange={(e) =>
                    setFormData(
                      formData.targetType === 'PRODUCT'
                        ? { ...formData, targetId: e.target.value }
                        : { ...formData, targetCategory: e.target.value }
                    )
                  }
                >
                  <option value="">-- SELECT FROM REGISTRY --</option>
                  {formData.targetType === 'PRODUCT'
                    ? products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name.toUpperCase()} (LKR {p.price})
                        </option>
                      ))
                    : categories.map((c) => (
                        <option key={c} value={c}>
                          {c.toUpperCase()}
                        </option>
                      ))}
                </select>

                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-[#D4AF37]">
                  <Zap size={14} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">
                  Protocol Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  placeholder="E.G. SEASONAL CLEARANCE"
                  className="w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 text-sm uppercase font-bold text-white focus:border-[#D4AF37] outline-none transition-all placeholder:text-gray-600"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">
                    Price Model
                  </label>
                  <select
                    value={formData.type}
                    className="w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 text-sm font-bold text-white outline-none focus:border-[#D4AF37] transition-all"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="PERCENTAGE">% REDUCTION</option>
                    <option value="FIXED_AMOUNT">FIXED LKR</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block">
                    Valuation
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    placeholder="00"
                    className="w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 text-sm font-mono text-white focus:border-[#D4AF37] outline-none transition-all placeholder:text-gray-600"
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block flex items-center gap-2">
                  <Calendar size={12} />
                  Activate On
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={formData.startDate}
                  className="calendar-input w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 text-sm text-white outline-none focus:border-[#D4AF37]"
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black block flex items-center gap-2">
                  <Calendar size={12} />
                  Terminate On
                </label>
                <input
                  type="date"
                  required
                  min={formData.startDate || today}
                  value={formData.endDate}
                  className="calendar-input w-full rounded-2xl bg-black/25 border border-white/10 px-5 py-4 text-sm text-white outline-none focus:border-[#D4AF37]"
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full rounded-2xl py-5 font-black text-[11px] uppercase tracking-[0.42em] flex items-center justify-center gap-4 transition-all shadow-2xl ${
                editingItem
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-[#D4AF37] hover:bg-white text-black'
              }`}
            >
              {editingItem ? (
                <RefreshCcw size={18} className="animate-spin-slow" />
              ) : (
                <ShieldCheck size={18} />
              )}
              {editingItem ? 'COMMIT MODIFICATIONS' : 'AUTHORIZE PROMOTION PROTOCOL'}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* RUNNING PROMOTIONS SECTION WITH EXPORT BUTTON */}
      <motion.div
        variants={itemVariants}
        className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] backdrop-blur-2xl p-6 lg:p-7"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                <Percent size={14} className="text-[#D4AF37]" />
              </div>
              <h2 className="text-xl font-bold text-white">Running Promotions</h2>
            </div>
            <p className="text-xs text-gray-500 ml-11">
              Active and scheduled discount protocols
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePromotionReport}
            className="px-5 py-2.5 bg-[#D4AF37] text-black rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-white transition-all flex items-center gap-2"
          >
            📄 Export PDF
          </motion.button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
          {promotions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Percent size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No active promotions</p>
              <p className="text-xs mt-1">Create a discount protocol above</p>
            </div>
          ) : (
            promotions.map((promo) => {
              const isExpired = new Date(promo.endDate) < new Date();
              const isActive = new Date(promo.startDate) <= new Date() && !isExpired;
              
              return (
                <div
                  key={promo.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-[#D4AF37]/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{promo.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {promo.targetType === 'PRODUCT' ? 'Product-specific' : `Category: ${promo.targetCategory}`}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isExpired 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : isActive
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {isExpired ? 'EXPIRED' : isActive ? 'ACTIVE' : 'SCHEDULED'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-[#D4AF37]" />
                      <span className="text-gray-300">
                        {promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `LKR ${promo.value} OFF`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#D4AF37]" />
                      <span className="text-gray-400 text-xs">
                        {promo.startDate} → {promo.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4);
          color: transparent;
        }
        .calendar-input::-webkit-calendar-picker-indicator {
          filter: invert(70%) sepia(50%) saturate(1000%) hue-rotate(10deg) brightness(100%) contrast(100%);
          cursor: pointer;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c4a030;
        }
      `}</style>
    </motion.div>
  );
};

const TargetButton = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-2xl border flex items-center justify-center gap-3 px-5 py-4 text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
      active
        ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg'
        : 'bg-white/[0.03] border-white/10 text-gray-500 hover:text-white hover:bg-white/[0.06]'
    }`}
  >
    {icon} {label}
  </button>
);

export default PromotionManager;