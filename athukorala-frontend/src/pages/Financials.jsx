import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Activity,
  PieChart as PieIcon,
  TrendingUp,
  Package
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 }
  }
};

const Financials = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#D4AF37', '#AA8A2E', '#806622', '#554417', '#2B220B'];

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/summary")
      .then(res => res.json())
      .then(data => {
        setReportData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-20 text-center text-[#D4AF37] font-black tracking-[0.4em]">
        LOADING ANALYTICS...
      </div>
    );
  }

  const chartData = Object.keys(reportData.categoryValuations).map(key => ({
    name: key.toUpperCase(),
    value: reportData.categoryValuations[key],
    units: reportData.itemsByCategory[key]
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* HEADER */}
      <motion.div
        variants={itemVariants}
        className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
          Financial Analytics
        </p>
        <h2 className="text-3xl font-black text-white">
          System Financial Overview
        </h2>
      </motion.div>

      {/* STATS */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <StatCard
          title="Total Stock Value"
          value={`LKR ${reportData.totalStockValue.toLocaleString()}`}
          icon={<TrendingUp className="text-[#D4AF37]" size={22} />}
          accent="gold"
        />

        <StatCard
          title="Total Units"
          value={`${reportData.totalUnitsStored.toLocaleString()}`}
          subtitle="UNITS"
          icon={<Package className="text-emerald-400" size={22} />}
          accent="default"
        />

        <StatCard
          title="Categories"
          value={chartData.length}
          subtitle="ACTIVE"
          icon={<Activity className="text-cyan-400" size={22} />}
          accent="default"
        />
      </motion.div>

      {/* CHARTS */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* PIE CHART */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 h-[420px]">
          <h3 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
            <PieIcon size={14} /> Category Valuation
          </h3>

          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: '#000',
                  border: '1px solid rgba(212,175,55,0.2)'
                }}
              />

              <Legend wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 h-[420px]">
          <h3 className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
            <Activity size={14} /> Inventory Density
          </h3>

          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />

              <Bar dataKey="units" fill="#D4AF37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ title, value, subtitle, icon, accent = 'default' }) => {
  const styles = {
    default: 'border-white/10 bg-white/[0.04]',
    gold: 'border-[#D4AF37]/20 bg-[#D4AF37]/10'
  };

  return (
    <div className={`rounded-3xl border ${styles[accent]} p-5`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase text-gray-400 tracking-widest">
            {title}
          </p>
          <h3 className="text-xl font-black mt-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Financials;