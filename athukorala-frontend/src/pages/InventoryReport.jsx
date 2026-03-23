import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, AlertOctagon, DollarSign } from 'lucide-react';
import DailySalesChart from '../components/DailySalesChart'; // Imported

const InventoryReport = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/inventory/report/summary")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Report System Offline"));
  }, []);

  if (!data) return <div className="p-20 text-[10px] font-black tracking-widest text-gray-500">GENERATING ARCHIVES...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 font-sans">
      <header className="mb-20">
        <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.6em] uppercase mb-4">Executive Analytics</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Monthly <span className="text-transparent stroke-text">Summary</span></h1>
      </header>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <ReportCard title="Total Assets Value" value={`LKR ${data.totalInventoryValue.toLocaleString()}`} icon={<DollarSign size={24}/>} color="text-[#D4AF37]" />
        <ReportCard title="Active SKU Count" value={data.totalProductCount} icon={<BarChart3 size={24}/>} color="text-white" />
        <ReportCard title="Critical Alerts" value={data.lowStockAlertCount} icon={<AlertOctagon size={24}/>} color="text-red-500" />
      </div>

      {/* NEW: REVENUE ANALYTICS CHART */}
      <div className="mb-12">
        <DailySalesChart salesData={data.dailyRevenue} />
      </div>

      {/* CATEGORY DISTRIBUTION */}
      <div className="bg-white/[0.02] border border-white/5 p-10">
        <h3 className="text-[10px] font-black tracking-[0.4em] uppercase mb-10 flex items-center gap-4 text-gray-500">
          <PieChart size={16}/> Category Distribution Matrix
        </h3>
        <div className="space-y-6">
          {Object.entries(data.categoryDistribution).map(([cat, count]) => (
            <div key={cat} className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>{cat}</span>
                <span className="text-[#D4AF37]">{count} ITEMS</span>
              </div>
              <div className="h-[2px] bg-white/5 w-full">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${(count / data.totalProductCount) * 100}%` }}
                  className="h-full bg-[#D4AF37]" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

const ReportCard = ({ title, value, icon, color }) => (
  <div className="bg-white/[0.01] border border-white/5 p-8 group hover:border-[#D4AF37]/30 transition-all">
    <div className={`mb-6 ${color} opacity-50 group-hover:opacity-100 transition-opacity`}>{icon}</div>
    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">{title}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);

export default InventoryReport;