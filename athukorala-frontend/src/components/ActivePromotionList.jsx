import React, { useEffect, useState } from 'react';
import { Trash2, Tag, Clock, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ActivePromotionList = ({ refreshTrigger }) => {
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
        toast.success("Protocol Purged", { icon: '🗑️', style: { borderRadius: '0px', background: '#000', color: '#fff' } });
        fetchPromos();
      }
    }
  };

  return (
    <div className="space-y-6 text-left max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
      {promos.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 border border-dashed border-white/5">
          <Zap className="text-gray-800 mb-4" size={40} />
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em]">Registry Empty</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          {promos.map(promo => (
            <motion.div 
              layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              key={promo.id} 
              className="p-8 bg-white/[0.02] border border-white/5 relative group hover:border-[#D4AF37]/30 transition-all shadow-xl"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Tag size={12} className="text-[#D4AF37]" />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">{promo.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-6">
                     <div className="flex flex-col">
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-1">Benefit</span>
                        <span className="text-lg font-mono font-black text-[#D4AF37]">
                          {promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `LKR ${promo.value} OFF`}
                        </span>
                     </div>
                     <div className="h-8 w-[1px] bg-white/5" />
                     <div className="flex flex-col">
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-1">Termination</span>
                        <span className="text-[10px] font-mono flex items-center gap-2 text-gray-400">
                          <Clock size={12}/> {promo.endDate}
                        </span>
                     </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-[8px] font-black uppercase text-green-500 tracking-widest">Active</span>
                  </div>
                  <button onClick={() => handleDelete(promo.id)} className="p-3 bg-white/5 border border-white/10 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ActivePromotionList;