import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, PackageSearch, RefreshCcw } from 'lucide-react';

const LowStockPanel = () => {
  const [lowStockItems, setLowStockItems] = useState([]);

  const checkStock = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/products/low-stock");
      const data = await res.json();
      setLowStockItems(data);
    } catch (err) {
      console.error("Stock Watchdog Offline");
    }
  };

  useEffect(() => {
    checkStock();
    // Industrial Step: Re-check every 60 seconds automatically
    const interval = setInterval(checkStock, 60000);
    return () => clearInterval(interval);
  }, []);

  if (lowStockItems.length === 0) return null;

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="bg-red-500/10 border-b border-red-500/20 p-4 mb-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-red-500 p-2 rounded-sm animate-pulse">
            <AlertTriangle size={16} className="text-black" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Inventory Critical Warning</p>
            <p className="text-xs text-gray-400 font-medium">
              {lowStockItems.length} hardware assets have fallen below reorder thresholds.
            </p>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto max-w-2xl px-4 no-scrollbar">
          {lowStockItems.map(item => (
            <div key={item.id} className="bg-black/40 border border-white/5 px-4 py-2 flex items-center gap-4 flex-shrink-0">
              <span className="text-[10px] font-mono text-white uppercase">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-red-400 font-bold">{item.stockQuantity}</span>
                <ArrowRight size={10} className="text-gray-700" />
                <span className="text-[10px] text-gray-500 italic">Min: {item.reorderLevel}</span>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="text-[9px] font-black uppercase tracking-widest text-white border border-white/10 px-4 py-2 hover:bg-white/5 transition-all flex items-center gap-2"
        >
          <RefreshCcw size={12} /> Sync
        </button>
      </div>
    </motion.div>
  );
};

export default LowStockPanel;