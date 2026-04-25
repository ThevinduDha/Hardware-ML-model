import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Bell,
  CheckCircle,
  LayoutDashboard,
  Activity,
  LogOut,
  ChevronRight,
  Clock,
  AlertCircle,
  Sparkles,
  Gift,
  Megaphone,
  Star,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import StaffInventoryControl from '../components/StaffInventoryControl';
import ThemeToggle from '../components/ThemeToggle';

const sweepVariants = {
  initial: { opacity: 0, x: 40, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: 'circOut' }
  },
  exit: {
    opacity: 0,
    x: -40,
    filter: 'blur(10px)',
    transition: { duration: 0.3 }
  }
};

// Notice card animation variants
const noticeCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  }),
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.2, type: 'spring', stiffness: 300 }
  },
  tap: { scale: 0.98 }
};

// Floating background animation
const floatingIconVariants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('portal');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acknowledgedNotices, setAcknowledgedNotices] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Operator"}');

  // ✅ THEME INITIALIZATION - FIXES DARK MODE PERSISTENCE
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const shouldBeDark = savedTheme === "dark" || savedTheme === null;
    
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      if (savedTheme === null) localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Fetch notices
  useEffect(() => {
    fetch("http://localhost:8080/api/notices/staff")
      .then(res => res.json())
      .then(data => {
        setNotices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Notice system unreachable.");
        setLoading(false);
      });
  }, []);

  const handleAcknowledge = (noticeId, title) => {
    if (!acknowledgedNotices.includes(noticeId)) {
      setAcknowledgedNotices([...acknowledgedNotices, noticeId]);
      toast.success(`✓ "${title}" acknowledged`, {
        icon: '📋',
        style: {
          borderRadius: '14px',
          background: '#050505',
          color: '#D4AF37',
          border: '1px solid #D4AF37',
          fontSize: '12px',
          fontWeight: '700'
        }
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const getPriorityColor = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('urgent') || titleLower.includes('emergency')) return 'border-red-500';
    if (titleLower.includes('important')) return 'border-yellow-500';
    return 'border-[#D4AF37]';
  };

  const getPriorityIcon = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('urgent')) return <AlertCircle size={16} className="text-red-400" />;
    if (titleLower.includes('important')) return <Star size={16} className="text-yellow-400" />;
    return <Megaphone size={16} className="text-[#D4AF37]" />;
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-72 border-r border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/45 backdrop-blur-2xl p-8 flex flex-col gap-10 relative z-50 h-screen sticky top-0"
      >
        <div className="flex items-center gap-4 px-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-11 h-11 rounded-2xl bg-[#D4AF37] flex items-center justify-center shadow-[0_0_22px_rgba(212,175,55,0.18)]"
          >
            <Activity className="text-black" size={22} />
          </motion.div>

          <div className="flex flex-col">
            <span className="font-black tracking-[0.3em] uppercase text-sm text-black dark:text-white">
              Athukorala
            </span>
            <span className="text-[8px] font-bold text-[#D4AF37] tracking-[0.2em] uppercase mt-1">
              Operational Node
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Operational Portal"
            active={activeTab === 'portal'}
            onClick={() => setActiveTab('portal')}
          />
          <NavItem
            icon={<Package size={18} />}
            label="Inventory Control"
            active={activeTab === 'inventory'}
            onClick={() => setActiveTab('inventory')}
          />
          <NavItem
            icon={<Bell size={18} />}
            label="Internal Notices"
            active={activeTab === 'notices'}
            onClick={() => setActiveTab('notices')}
          />
        </nav>

        <div className="mt-auto pt-8 border-t border-gray-200 dark:border-white/6 space-y-3">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all text-[10px] font-bold uppercase tracking-widest group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Terminate Session
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 lg:px-10 py-8 lg:py-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[150px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

        <AnimatePresence mode="wait">
          {/* PORTAL */}
          {activeTab === 'portal' && (
            <motion.div
              key="portal"
              variants={sweepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-10"
            >
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-[28px] border border-gray-200 dark:border-white/10 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-2xl p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.28)] relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent"
                />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-[#D4AF37]" size={20} />
                    <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
                      OPERATIONAL PORTAL
                    </p>
                  </div>
                  
                  <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-black dark:text-white leading-tight">
                    Welcome back,{' '}
                    <span className="text-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/20 to-transparent px-3 inline-block">
                      {user.name.split(' ')[0]}
                    </span>
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 max-w-2xl">
                    Your command center for monitoring notices, inventory tasks, and daily warehouse operations from one secure interface.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-3 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-6 py-3 backdrop-blur-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.22em]">
                        Active Session • {new Date().toLocaleTimeString()}
                      </span>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3"
                    >
                      <Bell size={14} className="text-[#D4AF37]" />
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.22em]">
                        {notices.length} Active Notices
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Main Grid - NOTICES SECTION ENHANCED */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ENHANCED NOTICES SECTION - BIGGER AND MORE ATTRACTIVE */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:col-span-1 space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Bell className="text-[#D4AF37]" size={24} />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                        />
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                        Management Notices
                      </h3>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setActiveTab('notices')}
                      className="text-xs text-gray-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                    >
                      View All <ArrowRight size={12} />
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="h-32 rounded-2xl bg-gray-200 dark:bg-white/5 animate-pulse"
                          />
                        ))}
                      </div>
                    ) : notices.length > 0 ? (
                      <AnimatePresence>
                        {notices.slice(0, 3).map((notice, index) => (
                          <motion.div
                            key={notice.id}
                            custom={index}
                            variants={noticeCardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            whileTap="tap"
                            className={`relative rounded-2xl border-l-4 ${getPriorityColor(notice.title)} bg-gradient-to-r from-gray-50 to-white dark:from-black/40 dark:to-black/20 backdrop-blur-sm p-6 cursor-pointer group overflow-hidden shadow-lg`}
                            onClick={() => handleAcknowledge(notice.id, notice.title)}
                          >
                            {/* Background animation */}
                            <motion.div
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                            />

                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-transparent" />

                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <motion.div
                                    animate={floatingIconVariants.animate}
                                    className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center"
                                  >
                                    {getPriorityIcon(notice.title)}
                                  </motion.div>
                                  <div>
                                    <h4 className="text-base font-black uppercase tracking-wider text-black dark:text-white">
                                      {notice.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Clock size={10} className="text-gray-400" />
                                      <p className="text-[9px] text-gray-400 uppercase tracking-wider">
                                        {new Date().toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {acknowledgedNotices.includes(notice.id) ? (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30"
                                  >
                                    <span className="text-[8px] font-black text-green-400 uppercase tracking-wider flex items-center gap-1">
                                      <CheckCircle size={10} /> Acknowledged
                                    </span>
                                  </motion.div>
                                ) : (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAcknowledge(notice.id, notice.title);
                                    }}
                                    className="px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-all"
                                  >
                                    <span className="text-[8px] font-black text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
                                      <CheckCircle size={10} /> Acknowledge
                                    </span>
                                  </motion.button>
                                )}
                              </div>

                              <div className="pl-13 border-l-2 border-[#D4AF37]/20 pl-4 ml-1">
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {notice.message}
                                </p>
                              </div>

                              {/* Progress bar for acknowledgment */}
                              {!acknowledgedNotices.includes(notice.id) && (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 10, ease: 'linear' }}
                                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent"
                                />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 p-12 text-center"
                      >
                        <Gift size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-500">No active notices at this time.</p>
                        <p className="text-xs text-gray-400 mt-2">Check back later for updates.</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Notice statistics */}
                  {notices.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="grid grid-cols-3 gap-3 mt-4"
                    >
                      <div className="text-center p-3 rounded-xl bg-gray-100 dark:bg-white/5">
                        <p className="text-2xl font-black text-[#D4AF37]">{notices.length}</p>
                        <p className="text-[9px] uppercase tracking-wider text-gray-500">Total</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gray-100 dark:bg-white/5">
                        <p className="text-2xl font-black text-green-500">{acknowledgedNotices.length}</p>
                        <p className="text-[9px] uppercase tracking-wider text-gray-500">Acknowledged</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gray-100 dark:bg-white/5">
                        <p className="text-2xl font-black text-yellow-500">{notices.length - acknowledgedNotices.length}</p>
                        <p className="text-[9px] uppercase tracking-wider text-gray-500">Pending</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* MAIN ACTION CARD */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <OpCard
                    icon={<Package size={48} />}
                    title="Inventory Control"
                    desc="Execute real-time stock adjustments, manage physical hardware assets, and synchronize warehouse registries with the core database for immediate fulfillment accuracy."
                    action="Manage Stock"
                    onClick={() => setActiveTab('inventory')}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* INVENTORY */}
          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              variants={sweepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="rounded-[28px] border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/[0.04] backdrop-blur-2xl p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
                  STOCK PROTOCOL
                </p>
                <h2 className="text-4xl lg:text-5xl font-black text-black dark:text-white">
                  Inventory Control
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 max-w-2xl">
                  Manage and update stock levels in real-time with secure inventory controls.
                </p>
              </div>

              <StaffInventoryControl />
            </motion.div>
          )}

          {/* NOTICES FULL PAGE */}
          {activeTab === 'notices' && (
            <motion.div
              key="notices"
              variants={sweepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="rounded-[28px] border border-gray-200 dark:border-white/10 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-2xl p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
                <div className="flex items-center gap-3 mb-2">
                  <Megaphone className="text-[#D4AF37]" size={24} />
                  <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
                    COMMUNICATION ARCHIVE
                  </p>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-black dark:text-white">
                  Internal Notices
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 max-w-2xl">
                  Complete archive of all internal staff communications and operational announcements.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {notices.length > 0 ? (
                  notices.map((notice, index) => (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.01, y: -4 }}
                      className={`rounded-[24px] border-l-4 ${getPriorityColor(notice.title)} bg-gradient-to-r from-gray-50 to-white dark:from-black/30 dark:to-black/10 backdrop-blur-xl p-8 relative overflow-hidden group shadow-xl`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-all" />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center">
                              {getPriorityIcon(notice.title)}
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-black dark:text-white">
                                {notice.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock size={12} />
                                  {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAcknowledge(notice.id, notice.title)}
                            className={`px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
                              acknowledgedNotices.includes(notice.id)
                                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                                : 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                            }`}
                          >
                            {acknowledgedNotices.includes(notice.id) ? (
                              <>
                                <CheckCircle size={16} /> Acknowledged
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} /> Mark as Read
                              </>
                            )}
                          </motion.button>
                        </div>

                        <div className="pl-6 border-l-2 border-[#D4AF37]/30">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                            {notice.message}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <ShieldCheck size={12} />
                            Verified Administrative Notice
                          </span>
                          {acknowledgedNotices.includes(notice.id) && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-[10px] font-bold text-green-500 uppercase tracking-wider flex items-center gap-1"
                            >
                              <CheckCircle size={12} /> Read by {user.name.split(' ')[0]}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-[24px] border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/[0.04] backdrop-blur-xl p-16 text-center"
                  >
                    <Gift size={64} className="text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-2">No Notices Available</h3>
                    <p className="text-gray-500">Check back later for important updates.</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .stroke-text {
            -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5);
            color: transparent;
          }
        `}</style>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${
      active
        ? 'bg-[#D4AF37] text-black font-black shadow-[0_10px_30px_rgba(212,175,55,0.2)]'
        : 'text-gray-600 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
    }`}
  >
    <div className="flex items-center gap-5 text-[11px] font-black tracking-[0.2em] uppercase">
      {icon} {label}
    </div>
    {active && <ChevronRight size={14} />}
  </motion.button>
);

const OpCard = ({ icon, title, desc, action, onClick }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className="rounded-[28px] border border-gray-200 dark:border-white/10 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-2xl p-8 lg:p-10 hover:border-[#D4AF37]/35 transition-all group flex flex-col items-start shadow-[0_20px_60px_rgba(0,0,0,0.25)] h-full relative overflow-hidden"
  >
    <motion.div
      animate={{ rotate: [0, 10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl"
    />
    
    <div className="relative z-10">
      <div className="text-[#D4AF37] mb-8 p-6 rounded-3xl bg-gray-200 dark:bg-black/30 border border-gray-300 dark:border-white/10 group-hover:border-[#D4AF37]/40 transition-colors shadow-inner">
        {icon}
      </div>

      <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4 text-black dark:text-white">
        {title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-xl">
        {desc}
      </p>

      <motion.button
        whileHover={{ x: 6 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full rounded-2xl py-5 border border-[#D4AF37]/20 text-[11px] font-black uppercase tracking-[0.38em] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center justify-center gap-3 group/btn shadow-lg"
      >
        {action}
        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  </motion.div>
);

export default StaffDashboard;