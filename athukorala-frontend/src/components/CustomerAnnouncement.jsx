import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Clock, ChevronRight, Sparkles, Calendar, Timer } from 'lucide-react';

const CustomerAnnouncement = ({ onSecureOffer }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/api/notices/customer")
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // --- UPDATED FILTER: Include Active AND Upcoming ---
        const filtered = (Array.isArray(data) ? data : []).filter(item => {
          const start = new Date(item.startDate);
          const end = new Date(item.expiryDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          
          // Logic: Show if it hasn't expired yet (Today <= Expiry)
          return now <= end;
        });

        setAnnouncements(filtered);
      })
      .catch(err => console.error("Announcement stream offline"));
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[currentIndex];
  
  // Logic to check if the protocol is actually active right now or starting later
  const isUpcoming = new Date(current.startDate) > new Date();

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className={`mb-12 relative overflow-hidden bg-black border ${isUpcoming ? 'border-blue-500/30' : 'border-[#D4AF37]/30'} p-8 backdrop-blur-3xl group text-left shadow-2xl`}
        >
          <div className={`absolute inset-0 ${isUpcoming ? 'bg-blue-500/5' : 'bg-[#D4AF37]/5'} animate-pulse`} />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 text-left">
            <div className="flex items-start gap-6 text-left">
              <div className={`p-4 ${isUpcoming ? 'bg-blue-600' : 'bg-[#D4AF37]'} text-black rounded-sm shadow-2xl shrink-0 transition-colors duration-500`}>
                {isUpcoming ? <Timer size={24} /> : <Sparkles size={24} className="animate-spin-slow" />}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-4 mb-3 text-left">
                  <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${isUpcoming ? 'text-blue-400' : 'text-[#D4AF37]'} text-left`}>
                    {isUpcoming ? 'Upcoming Protocol' : 'Active Promotion Protocol'}
                  </span>
                  {current.urgent && (
                    <span className="px-3 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest animate-pulse">
                      High Priority
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white text-left">{current.title}</h2>
                
                <div className="flex items-center gap-4 mt-2 mb-4 text-left">
                   <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest text-left">
                      <Calendar size={12}/> {isUpcoming ? 'Starts On:' : 'Effective:'} {new Date(current.startDate).toLocaleDateString()}
                   </div>
                   <div className="w-1 h-1 rounded-full bg-white/20 text-left" />
                   <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest text-left">
                      <Clock size={12}/> Deployment Ends: {new Date(current.expiryDate).toLocaleDateString()}
                   </div>
                </div>

                <p className="text-gray-400 text-sm max-w-2xl leading-relaxed italic border-l-2 border-white/10 pl-4 text-left">
                  "{current.message}"
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-5 min-w-[220px] text-left">
              <button 
                onClick={onSecureOffer}
                disabled={isUpcoming}
                className={`w-full px-8 py-4 ${isUpcoming ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-white/5' : 'bg-[#D4AF37] text-black hover:bg-white'} text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 group/btn`}
              >
                {isUpcoming ? 'Coming Soon' : 'Secure Offer'} <ChevronRight size={16} className={isUpcoming ? 'opacity-0' : 'group-hover/btn:translate-x-1 transition-transform'} />
              </button>
            </div>
          </div>

          {announcements.length > 1 && (
            <div className="flex gap-3 mt-8 text-left">
              {announcements.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentIndex(i)} 
                  className={`h-1 transition-all duration-500 ${i === currentIndex ? (isUpcoming ? 'w-12 bg-blue-500' : 'w-12 bg-[#D4AF37]') : 'w-3 bg-white/10 hover:bg-white/30'}`} 
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <style>{`.animate-spin-slow { animation: spin 8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CustomerAnnouncement;