import React from 'react';
import { motion } from 'framer-motion';

const DailySalesChart = ({ salesData }) => {
  if (!salesData) return null;

  const entries = Object.entries(salesData).sort().slice(-7); // Last 7 days
  const maxRevenue = Math.max(...entries.map(([, val]) => val), 1);

  return (
    <div className="bg-white/[0.02] border border-white/5 p-10 mt-8">
      <h3 className="text-[10px] font-black tracking-[0.4em] uppercase mb-12 text-gray-500">7-Day Revenue Protocol</h3>
      
      <div className="flex items-end justify-between h-48 gap-4">
        {entries.map(([date, amount]) => (
          <div key={date} className="flex-1 flex flex-col items-center gap-4 group">
            <div className="relative w-full flex flex-col items-center">
              {/* Tooltip on Hover */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#D4AF37] text-black text-[9px] font-black px-2 py-1 rounded-sm whitespace-nowrap">
                LKR {amount.toLocaleString()}
              </div>
              
              {/* The Bar */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${(amount / maxRevenue) * 100}%` }}
                className="w-full bg-white/10 group-hover:bg-[#D4AF37] transition-colors min-h-[4px]"
              />
            </div>
            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">
              {new Date(date).toLocaleDateString('en-GB', { weekday: 'short' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailySalesChart;