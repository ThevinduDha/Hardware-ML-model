import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Clock, ChevronRight } from 'lucide-react';

const CustomerAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch specifically for the customer audience [cite: 950-953]
    fetch("http://localhost:8080/api/notices/customer")
      .then(res => res.json())
      .then(data => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(err => console.error("Announcement stream offline"));
  }, []);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 relative overflow-hidden bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-8 backdrop-blur-xl group text-left"
      >
        {/* Animated Background Element */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4AF37]/10 blur-3xl rounded-full animate-pulse" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-5">
            <div className="p-3 bg-[#D4AF37] text-black rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <Megaphone size={20} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Strategic Announcement</span>
                {current.isUrgent && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest animate-bounce">
                    Urgent
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">{current.title}</h2>
              <p className="text-gray-400 text-sm max-w-2xl leading-relaxed italic">
                "{current.message}"
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 min-w-[200px]">
            <div className="flex items-center gap-2 text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest">
              <Clock size={12} /> Valid Until: {current.expiryDate ? new Date(current.expiryDate).toLocaleDateString() : 'TBD'}
            </div>
            <button className="px-6 py-3 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-2">
              View Promotion <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Navigation Dots if multiple announcements exist [cite: 954] */}
        {announcements.length > 1 && (
          <div className="flex gap-2 mt-6">
            {announcements.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 transition-all ${i === currentIndex ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/10'}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomerAnnouncement;