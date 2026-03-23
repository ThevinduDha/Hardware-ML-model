import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, PlusCircle, MinusCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StockAdjustment = () => {
  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAdjustment = async (type) => {
    if (!productId) return toast.error("ENTER ASSET SERIAL/ID");
    
    const adjustmentValue = type === 'ADD' ? Math.abs(amount) : -Math.abs(amount);
    setIsProcessing(true);
    
    const loading = toast.loading("Updating Registry...");

    try {
      const res = await fetch(`http://localhost:8080/api/products/${productId}/adjust-stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: adjustmentValue })
      });

      if (res.ok) {
        toast.success("Inventory Levels Re-calibrated", { id: loading });
        setAmount(0);
      } else {
        toast.error("Asset ID not found in registry", { id: loading });
      }
    } catch (err) {
      toast.error("Communication Protocol Failed", { id: loading });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 font-sans">
      <header className="mb-16">
        <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase mb-4">Inventory Operations</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter">Stock <span className="text-transparent stroke-text">Adjustment</span></h1>
      </header>

      <div className="max-w-2xl bg-white/[0.02] border border-white/5 p-12">
        <div className="space-y-10">
          {/* ASSET ID INPUT */}
          <div>
            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4 block">Target Asset ID</label>
            <div className="flex gap-4">
              <div className="p-4 bg-white/5 border border-white/10 text-[#D4AF37]"><Package size={20}/></div>
              <input 
                type="text" 
                placeholder="E.G. 104"
                className="flex-1 bg-black border border-white/10 p-4 text-xl font-bold tracking-widest outline-none focus:border-[#D4AF37] transition-all"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
          </div>

          {/* QUANTITY INPUT */}
          <div>
            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4 block">Adjustment Magnitude</label>
            <input 
              type="number" 
              placeholder="0"
              className="w-full bg-black border border-white/10 p-4 text-5xl font-black tracking-tighter outline-none focus:border-[#D4AF37] text-center"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleAdjustment('ADD')}
              disabled={isProcessing}
              className="bg-[#D4AF37] text-black p-6 font-black text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-[#E5C158] transition-all disabled:opacity-50"
            >
              <PlusCircle size={18} /> Inbound Stock
            </button>
            <button 
              onClick={() => handleAdjustment('REMOVE')}
              disabled={isProcessing}
              className="border border-red-500/50 text-red-500 p-6 font-black text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-red-500/10 transition-all disabled:opacity-50"
            >
              <MinusCircle size={18} /> Inventory Correction
            </button>
          </div>
        </div>
      </div>

      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

export default StockAdjustment;