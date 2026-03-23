import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, ArrowLeft, ExternalLink, Hash } from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:8080/api/orders/user/${user.id}`);
        const data = await res.json();
        // Sort by date (newest first)
        setOrders(data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      } catch (err) {
        toast.error("COULD NOT SYNC TRANSACTION LOGS");
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
      case 'DISPATCHED': return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
      case 'COMPLETED': return 'text-green-500 border-green-500/20 bg-green-500/5';
      default: return 'text-gray-500 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 font-sans selection:bg-[#D4AF37]">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition-all mb-12 uppercase text-[10px] font-bold tracking-[0.4em]">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> EXIT TO DASHBOARD
        </button>

        <header className="mb-20">
          <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4">Transaction Archives</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Order <span className="text-transparent stroke-text">History</span></h1>
        </header>

        <div className="space-y-6">
          {orders.length > 0 ? orders.map((order, index) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/[0.01] border border-white/5 p-8 hover:border-[#D4AF37]/30 transition-all flex flex-wrap lg:flex-nowrap items-center gap-12"
            >
              {/* ORDER IDENTIFIER */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Hash size={12} />
                  <span className="text-[10px] font-black tracking-widest uppercase">Protocol ID</span>
                </div>
                <h3 className="text-xl font-mono font-bold text-white tracking-widest">ATH-{order.id + 1000}</h3>
              </div>

              {/* LOGISTICS STATUS */}
              <div className="flex-shrink-0">
                <div className={`flex items-center gap-3 px-4 py-2 border text-[10px] font-black tracking-[0.2em] uppercase rounded-sm ${getStatusStyle(order.status)}`}>
                  {order.status === 'PENDING' && <Clock size={14} />}
                  {order.status === 'DISPATCHED' && <Truck size={14} />}
                  {order.status === 'COMPLETED' && <CheckCircle2 size={14} />}
                  {order.status}
                </div>
              </div>

              {/* DATE & ADDRESS */}
              <div className="flex-1 min-w-[200px]">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Deployment Date</p>
                <p className="text-xs text-gray-300 font-medium mb-4">{new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Logistics Destination</p>
                <p className="text-xs text-gray-400 truncate max-w-xs uppercase">{order.shippingAddress}</p>
              </div>

              {/* PRICE & ACTION */}
              <div className="text-right flex-shrink-0">
                <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">Final Authorized Total</p>
                <p className="text-2xl font-black text-white mb-4">LKR {order.totalAmount.toLocaleString()}</p>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white flex items-center gap-2 ml-auto transition-colors">
                  Details <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="py-32 border border-dashed border-white/5 flex flex-col items-center justify-center opacity-20">
               <Package size={48} className="mb-6" />
               <p className="text-[10px] font-black tracking-[0.5em] uppercase text-center">No Transaction Logs Detected</p>
            </div>
          )}
        </div>
      </div>
      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.4); color: transparent; }`}</style>
    </div>
  );
};

export default OrderHistory;