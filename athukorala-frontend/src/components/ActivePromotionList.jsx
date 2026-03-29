import React, { useEffect, useState } from 'react';
import { Trash2, Tag, Clock, Zap, Edit3, Activity, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ActivePromotionList = ({ refreshTrigger, onEdit }) => {
  const [promos, setPromos] = useState([]);

  const fetchPromos = () => {
    fetch("http://localhost:8080/api/promotions/all")
      .then(res => res.json())
      .then(data => setPromos(Array.isArray(data) ? data : []))
      .catch(err => console.error("Database connection severed"));
  };

  useEffect(() => { fetchPromos(); }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm("EXECUTE PROTOCOL TERMINATION?")) {
      const res = await fetch(`http://localhost:8080/api/promotions/delete/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Protocol Purged", { 
          icon: '🗑️', 
          style: { borderRadius: '0px', background: '#000', color: '#fff', border: '1px solid #ff4444', fontSize: '10px', fontWeight: 'bold' } 
        });
        fetchPromos();
      }
    }
  };

  return (
    <div className="space-y-4 text-left max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
      {promos.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 border border-dashed border-white/5 bg-white/[0.01]">
          <Zap className="text-gray-800 mb-4 animate-pulse" size={40} />
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">No Active Protocols Found</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          {promos.map((promo, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              key={promo.id} 
              className="relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 group hover:border-[#D4AF37]/40 transition-all duration-500 shadow-2xl"
            >
              {/* INDUSTRIAL ACCENT BAR */}
              <div className="absolute left-0 top-0 w-1 h-full bg-[#D4AF37] opacity-20 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-6 flex flex-col gap-6">
                {/* HEADER SECTION */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-black border border-white/10 group-hover:border-[#D4AF37]/30 transition-colors">
                        <Tag size={14} className="text-[#D4AF37]" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white leading-tight">{promo.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[8px] font-bold uppercase text-green-500/80 tracking-widest">Active System</span>
                        </div>
                    </div>
                  </div>

                  {/* ACTION SUITE */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(promo)}
                      className="p-2.5 bg-white/5 border border-white/5 text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all"
                      title="Edit Protocol"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(promo.id)}
                      className="p-2.5 bg-white/5 border border-white/5 text-gray-500 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all"
                      title="Terminate Protocol"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* DATA GRID */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                   <div className="bg-black/20 p-3 border-l-2 border-white/5">
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Benefit Model</p>
                      <p className="text-xl font-mono font-black text-[#D4AF37]">
                         {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `LKR ${promo.value}`} <span className="text-[10px] text-white/40 uppercase">Off</span>
                      </p>
                   </div>
                   <div className="bg-black/20 p-3 border-l-2 border-white/5 text-right">
                      <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Termination Schedule</p>
                      <p className="text-[11px] font-mono font-bold text-gray-400 flex items-center justify-end gap-2">
                         {promo.endDate} <Calendar size={12} className="text-gray-700"/>
                      </p>
                   </div>
                </div>

                {/* FOOTER METADATA */}
                <div className="flex justify-between items-center text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">
                   <span>Auth ID: REG-{promo.id}</span>
                   <span className="group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                      <Activity size={10} /> Authorized Asset
                   </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); }`}</style>
    </div>
  );
};

export default ActivePromotionList;