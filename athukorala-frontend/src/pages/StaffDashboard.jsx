import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Bell, CheckCircle, 
  LayoutDashboard, Activity, LogOut, ChevronRight, Box
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import StaffInventoryControl from '../components/StaffInventoryControl';

// --- ANIMATION VARIANTS (THE SWEEP EFFECT) ---
const sweepVariants = {
  initial: { opacity: 0, x: 40, filter: 'blur(10px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: "circOut" } },
  exit: { opacity: 0, x: -40, filter: 'blur(10px)', transition: { duration: 0.3 } }
};

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('portal'); 
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Operator"}');

  useEffect(() => {
    fetch("http://localhost:8080/api/notices/staff")
      .then(res => res.json())
      .then(data => {
        setNotices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Notice system unreachable.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden">
      
      {/* --- PERSISTENT SIDEBAR --- */}
      <motion.aside 
        initial={{ x: -280 }} 
        animate={{ x: 0 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-10 relative z-50 h-screen sticky top-0"
      >
        <div className="flex items-center gap-4 px-2 text-left">
          <div className="p-2 bg-[#D4AF37] rounded-sm shadow-2xl text-left">
            <Activity className="text-black" size={24} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-black tracking-[0.3em] uppercase text-sm text-left">Athukorala</span>
            <span className="text-[7px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase mt-1 text-left">Operational Node</span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Operational Portal" active={activeTab === 'portal'} onClick={() => setActiveTab('portal')} />
          <NavItem icon={<Package size={18}/>} label="Inventory Control" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
          <NavItem icon={<Bell size={18}/>} label="Internal Notices" active={activeTab === 'notices'} onClick={() => setActiveTab('notices')} />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-gray-500 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-widest group text-left">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Terminate Session
          </button>
        </div>
      </motion.aside>

      {/* --- DYNAMIC CONTENT AREA (ANIMATED) --- */}
      <main className="flex-1 p-12 overflow-y-auto relative text-left">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[150px] rounded-full -z-10" />

        <AnimatePresence mode="wait">
          
          {/* 1. OPERATIONAL PORTAL */}
          {activeTab === 'portal' && (
            <motion.div key="portal" variants={sweepVariants} initial="initial" animate="animate" exit="exit" className="space-y-20 text-left">
              <header className="flex flex-col md:flex-row justify-between items-end gap-8 text-left">
                <div className="text-left">
                  <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4 text-left">Operational Portal</p>
                  <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-2 text-left">Welcome,</h1>
                  <h2 className="text-8xl font-black uppercase tracking-tighter text-transparent stroke-text text-left">{user.name.split(' ')[0]}</h2>
                </div>
                <div className="text-right pb-2 bg-[#D4AF37]/5 border border-[#D4AF37]/20 px-8 py-5 text-left shadow-2xl">
                  <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-2 text-left">Shift Status</p>
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse text-left" />
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest text-left">Active Session</span>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left items-stretch">
                {/* NOTICES WIDGET */}
                <div className="lg:col-span-4 space-y-6 text-left">
                  <div className="flex items-center gap-3 mb-4 text-left">
                    <Bell className="text-[#D4AF37]" size={16} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-left">Management Notices</h3>
                  </div>
                  <div className="space-y-4 text-left">
                    {loading ? <div className="h-20 bg-white/5 animate-pulse text-left" /> : notices.map(notice => (
                      <div key={notice.id} className="p-6 bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all relative overflow-hidden group text-left">
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-[#D4AF37] opacity-50 text-left" />
                        <h4 className="text-[#D4AF37] text-[11px] font-black uppercase mb-2 tracking-widest text-left">{notice.title}</h4>
                        <p className="text-xs text-gray-400 italic mb-4 text-left">"{notice.message}"</p>
                        <button className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2 text-gray-600 hover:text-white transition-colors text-left">
                          <CheckCircle size={10} /> Acknowledge Receipt
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UPDATED: PRIMARY INVENTORY CARD (Expanded Layout) */}
                <div className="lg:col-span-8 text-left">
                  <OpCard 
                    icon={<Package size={48}/>} 
                    title="Inventory Control" 
                    desc="Execute real-time stock adjustments, manage physical hardware assets, and synchronize warehouse registries with the core database for immediate fulfillment accuracy." 
                    action="Manage Stock" 
                    onClick={() => setActiveTab('inventory')} 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. INVENTORY CONTROL TAB */}
          {activeTab === 'inventory' && (
            <motion.div key="inventory" variants={sweepVariants} initial="initial" animate="animate" exit="exit" className="space-y-10 text-left">
              <header className="text-left">
                <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4 text-left">Stock Protocol</p>
                <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-left">
                  Inventory <span className="text-transparent stroke-text text-left">Control</span>
                </h1>
              </header>
              <StaffInventoryControl />
            </motion.div>
          )}

          {/* 3. INTERNAL NOTICES TAB */}
          {activeTab === 'notices' && (
            <motion.div key="notices" variants={sweepVariants} initial="initial" animate="animate" exit="exit" className="space-y-10 text-left">
              <header className="text-left">
                <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4 text-left">Archive Hub</p>
                <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-left">
                  Internal <span className="text-transparent stroke-text text-left">Notices</span>
                </h1>
              </header>
              <div className="grid grid-cols-1 gap-4 text-left">
                {notices.map(notice => (
                  <div key={notice.id} className="p-8 bg-white/[0.02] border border-white/5 relative overflow-hidden group text-left">
                     <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37] opacity-20 group-hover:opacity-100 transition-opacity text-left" />
                     <h3 className="text-[#D4AF37] font-black uppercase tracking-widest mb-4 text-left">{notice.title}</h3>
                     <p className="text-gray-400 leading-relaxed mb-6 text-left">{notice.message}</p>
                     <div className="flex items-center gap-6 text-[10px] font-bold text-gray-600 uppercase text-left">
                        <span className="text-left">Issued: {new Date().toLocaleDateString()}</span>
                        <span className="flex items-center gap-2 text-left"><CheckCircle size={12}/> Verified Protocol</span>
                     </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-6 py-5 transition-all duration-300 group ${active ? 'bg-[#D4AF37] text-black font-black shadow-[0_10px_30px_rgba(212,175,55,0.2)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    <div className="flex items-center gap-5 text-[11px] font-black tracking-[0.2em] uppercase text-left">
      {icon} {label}
    </div>
    {active && <ChevronRight size={14} />}
  </button>
);

const OpCard = ({ icon, title, desc, action, onClick }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-12 bg-white/[0.01] border border-white/5 hover:border-[#D4AF37]/40 transition-all group flex flex-col items-start shadow-2xl backdrop-blur-sm text-left h-full"
  >
    <div className="text-[#D4AF37] mb-8 p-6 bg-black border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors shadow-inner text-left">
      {icon}
    </div>
    <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-left">{title}</h3>
    <p className="text-sm text-gray-500 mb-12 leading-relaxed max-w-md text-left">{desc}</p>
    <button 
      onClick={onClick}
      className="w-full py-6 border border-[#D4AF37]/20 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-3 group/btn shadow-lg text-left"
    >
      {action} <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
    </button>
  </motion.div>
);

export default StaffDashboard;