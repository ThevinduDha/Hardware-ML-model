import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ChevronRight,
  Sparkles,
  Calendar,
  Timer,
  Image as ImageIcon
} from 'lucide-react';

const CustomerAnnouncement = ({ onSecureOffer }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8080/api/notices/customer')
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const filtered = (Array.isArray(data) ? data : []).filter((item) => {
          const end = new Date(item.expiryDate);
          end.setHours(0, 0, 0, 0);
          return now <= end;
        });

        setAnnouncements(filtered);
      })
      .catch(() => console.error('Announcement stream offline'));
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
  const isUpcoming = new Date(current.startDate) > new Date();

  const imageUrl = getAnnouncementImage(current);

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.985 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className={`relative overflow-hidden rounded-[30px] border ${
            isUpcoming ? 'border-blue-500/25' : 'border-[#D4AF37]/25'
          } bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.28)]`}
        >
          <div
            className={`absolute inset-0 ${
              isUpcoming ? 'bg-blue-500/[0.04]' : 'bg-[#D4AF37]/[0.04]'
            }`}
          />

          <motion.div
            animate={{ x: ['-100%', '120%'] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute top-0 left-0 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-70"
          />

          <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr]">
            {/* LEFT CONTENT */}
            <div className="p-6 sm:p-7 lg:p-8 xl:p-10">
              <div className="flex items-start gap-4 sm:gap-5">
                <div
                  className={`mt-1 p-4 rounded-2xl shrink-0 ${
                    isUpcoming
                      ? 'bg-blue-500/15 border border-blue-400/20 text-blue-300'
                      : 'bg-[#D4AF37]/12 border border-[#D4AF37]/20 text-[#D4AF37]'
                  }`}
                >
                  {isUpcoming ? (
                    <Timer size={22} />
                  ) : (
                    <Sparkles size={22} className="animate-spin-slow" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                        isUpcoming ? 'text-blue-400' : 'text-[#D4AF37]'
                      }`}
                    >
                      {isUpcoming ? 'Upcoming Protocol' : 'Active Promotion'}
                    </span>

                    {current.urgent && (
                      <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-semibold uppercase tracking-[0.16em] animate-pulse">
                        High Priority
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                    {current.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 mb-5 text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={13} />
                      <span className="font-medium">
                        {isUpcoming ? 'Starts:' : 'Effective:'}{' '}
                        {new Date(current.startDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />

                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={13} />
                      <span className="font-medium">
                        Ends: {new Date(current.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed border-l-2 border-white/10 pl-4">
                    {current.message}
                  </p>

                  <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
                    <button
                      onClick={onSecureOffer}
                      disabled={isUpcoming}
                      className={`px-6 py-4 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        isUpcoming
                          ? 'bg-white/[0.04] border border-white/8 text-gray-500 cursor-not-allowed'
                          : 'bg-[#D4AF37] text-black hover:bg-white'
                      }`}
                    >
                      {isUpcoming ? 'Coming Soon' : 'Secure Offer'}
                      {!isUpcoming && (
                        <ChevronRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {announcements.length > 1 && (
                <div className="flex gap-3 mt-8">
                  {announcements.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === currentIndex
                          ? isUpcoming
                            ? 'w-12 bg-blue-500'
                            : 'w-12 bg-[#D4AF37]'
                          : 'w-3 bg-white/10 hover:bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative min-h-[260px] xl:min-h-full border-t xl:border-t-0 xl:border-l border-white/8">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt={current.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_35%)]" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-medium mb-2">
                        Featured Announcement
                      </p>
                      <p className="text-sm text-white font-medium line-clamp-2">
                        {current.title}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]">
                  <div className="text-center px-6">
                    <div className="w-14 h-14 mx-auto rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-[#D4AF37] mb-4">
                      <ImageIcon size={24} />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">
                      No announcement image available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const getAnnouncementImage = (announcement) => {
  if (!announcement) return '';

  return (
    announcement.imageUrl ||
    announcement.image ||
    announcement.photoUrl ||
    announcement.bannerUrl ||
    announcement.imagePath ||
    ''
  );
};

export default CustomerAnnouncement;