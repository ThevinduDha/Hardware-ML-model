import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, Package, Truck, CheckCircle2, 
  Clock, Search, AlertCircle, ExternalLink 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const StaffOrderQueue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    // Assuming your backend has this endpoint
    fetch("http://localhost:8080/api/orders/all")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => toast.error("Deployment Stream Offline"));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const loadingToast = toast.loading(`Updating order status to ${newStatus}...`);
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        toast.success("Deployment Protocol Updated", { id: loadingToast });
        fetchOrders();
      }
    } catch (err) {
      toast.error("Handshake Failed", { id: loadingToast });
    }
  };

  const filteredOrders = orders.filter(o => o.status === filter);

  return (
    <div className="space-y-8">
      {/* STATUS PROTOCOL SELECTOR */}
      <div className="flex gap-4 border-b border-white/5 pb-6">
        {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
              filter === status 
              ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
              : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="h-40 bg-white/5 animate-pulse" />
        ) : filteredOrders.length > 0 ? (
          <AnimatePresence mode='popLayout'>
            {filteredOrders.map((order) => (
              <motion.div
                layout
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/[0.02] border border-white/5 p-8 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-[#D4AF37]/20 transition-all"
              >
                <div className="flex items-center gap-8">
                  <div className="p-4 bg-black border border-white/5 text-[#D4AF37]">
                    <Package size={24} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Transaction ID:</span>
                      <span className="text-[10px] font-mono font-black text-white">#ATH-{order.id.toString().padStart(5, '0')}</span>
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">
                      {order.user?.name || "Anonymous Client"}
                    </h3>
                    <div className="flex gap-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Clock size={12}/> {new Date(order.orderDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-2 text-[#D4AF37]"><Truck size={12}/> {order.items?.length || 0} Assets</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center gap-6 mt-6 md:mt-0">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Settlement Total</p>
                    <p className="text-xl font-black text-white font-mono">LKR {order.totalPrice?.toLocaleString()}</p>
                  </div>

                  {filter === 'PENDING' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, 'PROCESSING')}
                      className="px-8 py-4 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-3"
                    >
                      Process Shipment <ExternalLink size={14}/>
                    </button>
                  )}

                  {filter === 'PROCESSING' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, 'SHIPPED')}
                      className="px-8 py-4 bg-green-600/20 border border-green-500/30 text-green-500 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-green-600 hover:text-white transition-all flex items-center gap-3"
                    >
                      Confirm Dispatch <Truck size={14}/>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-20 border border-dashed border-white/5 text-center">
            <AlertCircle size={40} className="mx-auto mb-4 text-gray-800" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">No active {filter} protocols found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffOrderQueue;