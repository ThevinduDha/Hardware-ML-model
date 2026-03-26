import React, { useEffect, useState } from 'react';
import { Trash2, Tag, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ActivePromotionList = ({ refreshTrigger }) => {
  const [promos, setPromos] = useState([]);

  const fetchPromos = () => {
    fetch("http://localhost:8080/api/promotions/all")
      .then(res => res.json())
      .then(data => setPromos(Array.isArray(data) ? data : []))
      .catch(err => console.error("Database link offline"));
  };

  // Re-fetch whenever the parent dashboard signals a successful creation
  useEffect(() => { fetchPromos(); }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm("Terminate this promotion protocol?")) {
      const res = await fetch(`http://localhost:8080/api/promotions/delete/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Protocol Terminated");
        fetchPromos();
      }
    }
  };

  return (
    <div className="space-y-4 text-left max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      {promos.length === 0 ? (
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest text-center py-20 border border-dashed border-white/5">
          No active protocols found
        </p>
      ) : promos.map(promo => (
        <div key={promo.id} className="p-6 bg-white/[0.03] border border-white/5 flex justify-between items-center group hover:border-[#D4AF37]/30 transition-all">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag size={12} className="text-[#D4AF37]" />
              <h4 className="text-[11px] font-black uppercase tracking-widest">{promo.title}</h4>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
               <span className="text-[#D4AF37]">{promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `LKR ${promo.value} OFF`}</span>
               <span className="flex items-center gap-1"><Clock size={10}/> EXP: {promo.endDate}</span>
            </div>
          </div>
          <button onClick={() => handleDelete(promo.id)} className="p-3 hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActivePromotionList;