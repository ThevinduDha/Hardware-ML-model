import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, Search, Filter, ArrowUpRight, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LowStockPanel from '../components/LowStockPanel';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');

  const fetchAllOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/orders/all");
      const data = await res.json();
      setOrders(data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (err) {
      toast.error("SYSTEM SYNC FAILURE");
    }
  };

  useEffect(() => { fetchAllOrders(); }, []);

  const updateStatus = async (id, newStatus) => {
    const loading = toast.loading(`Updating Protocol to ${newStatus}...`);
    try {
      const res = await fetch(`http://localhost:8080/api/orders/update-status/${id}?status=${newStatus}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        toast.success("LOGISTICS UPDATED", { id: loading });
      }
    } catch (err) {
      toast.error("GATEWAY ERROR", { id: loading });
    }
  };

  const stats = {
    totalValue: orders.reduce((acc, o) => acc + o.totalAmount, 0),
    pendingCount: orders.filter(o => o.status === 'PENDING').length,
    completedCount: orders.filter(o => o.status === 'COMPLETED').length
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37]">
      
      {/* --- INDUSTRIAL STOCK WATCHDOG --- */}
      <LowStockPanel />

      <div className="p-8 md:p-20">
        <header className="mb-16 flex justify-between items-end">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4">Command Center</p>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Global <span className="text-transparent stroke-text">Orders</span></h1>
          </motion.div>
          
          {/* FINANCIAL SUMMARY OVERLAY */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex gap-12 bg-white/[0.02] border border-white/5 p-8 backdrop-blur-md"
          >
            <div className="text-right">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Assets Value</p>
              <p className="text-2xl font-black text-[#D4AF37]">LKR {stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="w-[1px] bg-white/10"></div>
            <div className="text-right">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Active Protocols</p>
              <p className="text-2xl font-black text-white">{stats.pendingCount}</p>
            </div>
          </motion.div>
        </header>

        {/* FILTER CONTROLS */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 border-b border-white/5">
          {['ALL', 'PENDING', 'DISPATCHED', 'COMPLETED'].map((s) => (
            <button 
              key={s} onClick={() => setFilter(s)}
              className={`px-6 py-2 text-[10px] font-black tracking-widest uppercase transition-all border ${filter === s ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {orders.filter(o => filter === 'ALL' || o.status === filter).map((order) => (
              <motion.div 
                key={order.id} 
                layout 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/[0.01] border border-white/5 p-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-8 hover:bg-white/[0.02] transition-colors relative overflow-hidden group"
              >
                {/* Visual indicator for current status */}
                <div className={`absolute left-0 top-0 w-1 h-full transition-all ${order.status === 'PENDING' ? 'bg-amber-500' : order.status === 'DISPATCHED' ? 'bg-blue-500' : 'bg-green-500'}`}></div>

                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/[0.03] text-[#D4AF37] rounded-full group-hover:bg-[#D4AF37]/10 transition-colors">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-lg tracking-widest uppercase">ATH-{order.id + 1000}</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                      {new Date(order.orderDate).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex-1 px-10">
                   <p className="text-[9px] text-gray-600 font-bold uppercase mb-1 tracking-widest">Logistics Destination</p>
                   <p className="text-xs uppercase text-gray-300 truncate max-w-sm font-medium">{order.shippingAddress}</p>
                </div>

                <div className="text-right mr-10">
                   <p className="text-[9px] text-[#D4AF37] font-bold uppercase mb-1 tracking-widest">Authorized Total</p>
                   <p className="text-xl font-black tracking-tight text-white">LKR {order.totalAmount.toLocaleString()}</p>
                </div>

                {/* LOGISTICS ACTIONS */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateStatus(order.id, 'DISPATCHED')}
                    disabled={order.status === 'DISPATCHED' || order.status === 'COMPLETED'}
                    className="p-3 bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all rounded-sm disabled:opacity-20 disabled:grayscale"
                    title="Mark as Dispatched"
                  >
                    <Truck size={16} />
                  </button>
                  <button 
                    onClick={() => updateStatus(order.id, 'COMPLETED')}
                    disabled={order.status === 'COMPLETED'}
                    className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white transition-all rounded-sm disabled:opacity-20 disabled:grayscale"
                    title="Mark as Completed"
                  >
                    <CheckCircle size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

export default AdminOrders;