import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Construction,
  Droplets,
  PaintBucket,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  User,
  Lock,
  ArrowRight,
  Star,
  Sparkles,
  Factory,
  Truck,
  CheckCircle2,
  Megaphone,
  Timer,
  CalendarDays,
  BadgePercent,
  Gift,
  Image as ImageIcon,
  Award,
  TrendingUp,
  Globe,
  MessageCircle,
  ThumbsUp,
  ChevronRight,
  Diamond,
  Crown,
  Flame,
  Rocket,
  Coffee,
  Headphones,
  Settings,
  BarChart3,
  Users,
  Award as AwardIcon,
  Briefcase,
  Layers,
  Cpu,
  Wifi,
  BatteryCharging,
  Smile,
  Heart,
  Target,
  Eye,
  Volume2,
  Quote,
  Package,
  Boxes,
  Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import heroImg from '../assets/hero.png';

const LandingPage = () => {
  const { scrollY } = useScroll();
  const videoRef = useRef(null);

  const yHero = useTransform(scrollY, [0, 500], [0, 70]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0.78]);
  const scaleHero = useTransform(scrollY, [0, 400], [1, 0.95]);

  const [promoAnnouncements, setPromoAnnouncements] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);
  const [promoIndex, setPromoIndex] = useState(0);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 8) + 2,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        duration: Math.random() * 8 + 8,
        color: Math.random() > 0.7 ? '#D4AF37' : '#ffffff'
      })),
    []
  );

  const sectionReveal = {
    hidden: { opacity: 0, y: 55 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const softReveal = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: 'easeOut' }
    }
  };

  const staggerContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/notices/customer');
        const data = await res.json();

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const filtered = (Array.isArray(data) ? data : [])
          .filter((item) => {
            const end = new Date(item.expiryDate);
            end.setHours(0, 0, 0, 0);
            return now <= end;
          })
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        setPromoAnnouncements(filtered);
      } catch (error) {
        console.error('Announcement fetch failed', error);
        setPromoAnnouncements([]);
      }
    };

    const fetchPromotions = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/promotions/all');
        const data = await res.json();
        setActivePromotions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Promotions fetch failed', error);
        setActivePromotions([]);
      }
    };

    fetchAnnouncements();
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (promoAnnouncements.length <= 1) return;

    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoAnnouncements.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [promoAnnouncements.length]);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, []);

  const currentAnnouncement =
    promoAnnouncements.length > 0 ? promoAnnouncements[promoIndex] : null;

  const isUpcoming =
    currentAnnouncement && new Date(currentAnnouncement.startDate) > new Date();

  const activePromoCount = activePromotions.length;
  const liveNoticeCount = promoAnnouncements.length;

  const stats = [
    { icon: <Users size={24} />, value: '15K+', label: 'Happy Customers', color: 'from-blue-500 to-cyan-500' },
    { icon: <Package size={24} />, value: '5K+', label: 'Products Delivered', color: 'from-green-500 to-emerald-500' },
    { icon: <Truck size={24} />, value: '98%', label: 'On-Time Delivery', color: 'from-orange-500 to-red-500' },
    { icon: <AwardIcon size={24} />, value: '25+', label: 'Industry Awards', color: 'from-purple-500 to-pink-500' }
  ];

  const testimonials = [
    {
      name: 'R. Perera',
      role: 'Site Manager',
      text: 'Athukorala has been our go-to supplier for industrial hardware. Their quality and service are unmatched!',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      name: 'S. Fernando',
      role: 'Project Director',
      text: 'The team at Athukorala delivers excellence every time. Premium products and professional service.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      name: 'M. Jayawardena',
      role: 'Contractor',
      text: 'Best industrial supply experience in Sri Lanka. Highly recommended for any construction project.',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  ];

  return (
    <div className="bg-white dark:bg-[#050505] min-h-screen text-black dark:text-white overflow-x-hidden selection:bg-[#D4AF37] selection:text-black relative">
      <Navbar />

      {/* Custom Cursor */}
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 border-[#D4AF37] pointer-events-none z-[100] hidden lg:block"
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed w-2 h-2 rounded-full bg-[#D4AF37] pointer-events-none z-[100] hidden lg:block"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: 'spring', stiffness: 800, damping: 20 }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden z-10 min-h-screen flex items-center">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 2.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImg})`,
            y: yHero,
            opacity: opacityHero,
            scale: scaleHero
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-[#050505] dark:from-black/85 dark:via-black/60 dark:to-[#050505] from-white/90 via-white/65 to-white" />
        
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"
        />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

        {/* Enhanced Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                top: particle.top,
                left: particle.left,
                background: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(particle.id) * 20, 0],
                opacity: [0.1, 0.6, 0.1],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        <motion.div
          style={{ y: yHero }}
          className="relative z-20 max-w-7xl mx-auto px-6 pt-20 md:pt-28 lg:pt-32"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 backdrop-blur-sm mb-6">
                <Crown size={14} className="text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  Sri Lanka's Premier Industrial Supplier
                </span>
              </div>

              <h1 className="text-6xl sm:text-8xl md:text-[7rem] lg:text-[8rem] xl:text-[9rem] font-black tracking-[-0.05em] leading-[0.9] text-black dark:text-white">
                ATHUKORALA
              </h1>

              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="hidden md:block h-[2px] w-32 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <h2 className="text-4xl sm:text-5xl md:text-[4.5rem] lg:text-[5rem] font-light italic text-[#D4AF37] tracking-tight">
                  TRADERS
                </h2>
                <div className="hidden md:block h-[2px] w-32 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="max-w-[1380px] mx-auto"
            >
              <HeroPromotionShowcase
                currentAnnouncement={currentAnnouncement}
                promoAnnouncements={promoAnnouncements}
                promoIndex={promoIndex}
                setPromoIndex={setPromoIndex}
                isUpcoming={isUpcoming}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Scroll</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Counter Section */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-30 py-16 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={softReveal}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setHoveredStat(idx)}
                onHoverEnd={() => setHoveredStat(null)}
                className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-6 text-center overflow-hidden group cursor-pointer"
              >
                <motion.div
                  animate={{ scale: hoveredStat === idx ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10 flex items-center justify-center mb-4`}
                >
                  {stat.icon}
                </motion.div>
                <motion.p
                  key={stat.value}
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-black text-[#D4AF37]"
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Premium Transition */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.8 }}
        className="relative z-30"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        </div>
      </motion.section>

      {/* Marquee Brands */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-30 py-12 bg-gray-100 dark:bg-[#0a0a0a] border-y border-gray-200 dark:border-white/5 overflow-hidden"
      >
        <motion.div
          animate={{ x: [0, -1600] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="inline-flex whitespace-nowrap"
        >
          {[...Array(3)].map((_, round) => (
            <React.Fragment key={round}>
              {['LANKATILES', 'NIPPON PAINT', 'STANLEY', 'SIERRA CABLES', 'ORANGE ELECTRIC', 'BOSCH', 'PHILIPS', 'HAVALOCK'].map((brand, index) => (
                <motion.span
                  key={`${round}-${index}`}
                  whileHover={{ scale: 1.05, color: '#D4AF37' }}
                  className={`text-4xl md:text-5xl font-black mx-12 uppercase tracking-tighter cursor-pointer transition-all ${
                    index % 2 === 0 ? 'text-gray-300 dark:text-white/15' : 'text-[#D4AF37]/25 hover:text-[#D4AF37]'
                  }`}
                >
                  {brand}
                </motion.span>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-20 py-24 px-6 max-w-7xl mx-auto"
      >
        <motion.div variants={softReveal} className="text-center mb-16">
          <div className="inline-block mb-4">
            <Diamond size={24} className="text-[#D4AF37]" />
          </div>
          <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4 font-bold">
            Why Choose Us
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-black dark:text-white">
            Built for{' '}
            <span className="text-[#D4AF37] relative inline-block">
              Reliability
              <motion.div
                animate={{ width: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute bottom-0 left-0 h-1 bg-[#D4AF37]"
              />
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            From home projects to industrial operations, we supply dependable materials
            with consistent quality and service excellence.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<ShieldCheck size={32} />}
            title="Trusted Quality"
            text="ISO-certified products with rigorous quality control and industry-standard compliance."
            delay={0}
          />
          <FeatureCard
            icon={<Rocket size={32} />}
            title="Fast Service"
            text="Express delivery within 24 hours across major cities with real-time tracking."
            delay={1}
          />
          <FeatureCard
            icon={<Diamond size={32} />}
            title="Premium Experience"
            text="Dedicated account managers and 24/7 customer support for all clients."
            delay={2}
          />
        </motion.div>
      </motion.section>

      {/* Categories */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-20 py-24 px-6 max-w-7xl mx-auto"
      >
        <motion.div variants={softReveal} className="mb-14 text-center">
          <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4 font-bold">
            Our Categories
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-black dark:text-white">
            Core Product Lines
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Explore our extensive range of industrial and construction materials
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <CategoryCard 
            icon={<Construction size={36} />} 
            title="Industrial Tools" 
            count="1.2k+" 
            description="Professional grade equipment"
            delay={0}
          />
          <CategoryCard 
            icon={<Zap size={36} />} 
            title="Electrical" 
            count="850+" 
            description="Cables, switches & lighting"
            delay={1}
          />
          <CategoryCard 
            icon={<Droplets size={36} />} 
            title="Plumbing" 
            count="2.1k+" 
            description="Pipes, fittings & fixtures"
            delay={2}
          />
          <CategoryCard 
            icon={<PaintBucket size={36} />} 
            title="Paints & Coatings" 
            count="400+" 
            description="Premium finishes"
            delay={3}
          />
        </motion.div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-20 py-24 px-6 bg-gray-100 dark:bg-[#0a0a0a]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={softReveal} className="text-center mb-12">
            <Quote size={32} className="text-[#D4AF37] mx-auto mb-4" />
            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4 font-bold">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white">
              What Our Clients Say
            </h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-4 border-[#D4AF37]">
                  <img src={testimonials[activeTestimonial].image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mb-6">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <h4 className="text-lg font-bold text-black dark:text-white">{testimonials[activeTestimonial].name}</h4>
                <p className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`transition-all duration-300 ${
                    idx === activeTestimonial ? 'w-8 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-gray-400'
                  } rounded-full`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Location & Hours */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative z-20 py-28 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(212,175,55,0.08),transparent_40%)]" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <motion.div
            variants={softReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div animate={floatingAnimation.animate} className="inline-block mb-4">
              <MapPin size={32} className="text-[#D4AF37]" />
            </motion.div>
            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4 font-bold">
              Visit Us
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 uppercase tracking-tighter leading-tight text-black dark:text-white">
              Pitigala
              <br />
              <span className="text-[#D4AF37] relative inline-block">
                Headquarters
                <motion.div
                  animate={{ scaleX: [0, 1] }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#D4AF37] origin-left"
                />
              </span>
            </h2>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-6"
            >
              <ContactLink icon={<MapPin size={20} />} label="Location" val="New Town, Pitigala, Sri Lanka" />
              <ContactLink icon={<Phone size={20} />} label="Hotline" val="+94 912 291 126" />
              <ContactLink icon={<Mail size={20} />} label="Email" val="info@athukorala.com" isLink />
              <ContactLink icon={<Globe size={20} />} label="Website" val="www.athukorala.com" isLink />
            </motion.div>

            <motion.div
              variants={softReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="mt-8 p-6 rounded-2xl border border-[#D4AF37]/20 bg-gradient-to-r from-[#D4AF37]/10 to-transparent flex items-start gap-4"
            >
              <CheckCircle2 className="text-[#D4AF37] mt-1 animate-pulse" size={20} />
              <div>
                <p className="font-bold text-sm text-black dark:text-white">Verified Excellence</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                  Trusted by leading contractors and industrial professionals across Sri Lanka.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={softReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="p-8 md:p-10 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[30px] backdrop-blur-xl relative overflow-hidden group shadow-[0_20px_70px_rgba(0,0,0,0.28)]"
          >
            <div className="absolute -top-10 -right-10 text-[#D4AF37]/5 group-hover:text-[#D4AF37]/10 transition-colors">
              <Clock size={140} />
            </div>

            <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-8 text-[#D4AF37] flex items-center gap-3">
              <Timer size={24} />
              Operation Hours
            </h3>

            <div className="space-y-4">
              {[
                { day: 'Monday - Friday', hours: '08:00 AM – 05:30 PM' },
                { day: 'Saturday', hours: '09:00 AM – 04:00 PM' },
                { day: 'Sunday', hours: 'Closed' }
              ].map((schedule, index) => (
                <motion.div
                  key={schedule.day}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-4"
                >
                  <span className="text-gray-600 dark:text-gray-400 font-medium">{schedule.day}</span>
                  <span className={`font-mono text-sm tracking-tight ${schedule.hours === 'Closed' ? 'text-red-400' : 'text-black dark:text-white font-bold'}`}>
                    {schedule.hours}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center gap-3 bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/20"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
              <span className="text-xs font-black uppercase text-[#D4AF37] tracking-[0.15em]">
                Pitigala Branch is Currently Open
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-20 py-24 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-[32px] border border-gray-200 dark:border-white/10 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-xl px-6 md:px-12 py-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_45%)]" />
            <motion.div
              animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-20 -right-20 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-[80px]"
            />
            
            <div className="relative z-10 text-center">
              <div className="inline-block mb-6">
                <Crown size={48} className="text-[#D4AF37]" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-tight text-black dark:text-white">
                Ready to Experience
                <span className="text-[#D4AF37] block mt-2">Premium Hardware?</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
                Join thousands of satisfied customers who trust Athukorala for their industrial and construction needs.
              </p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-10 flex flex-wrap justify-center gap-5"
              >
                <motion.div variants={softReveal}>
                  <Link to="/auth?mode=customer">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212,175,55,0.3)' }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8960F] text-black font-black uppercase tracking-[0.2em] text-sm flex items-center gap-3 group"
                    >
                      <User size={18} />
                      Client Portal
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </motion.div>

                <motion.div variants={softReveal}>
                  <Link to="/auth?mode=admin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 rounded-2xl border border-gray-200 dark:border-white/15 bg-gray-100 dark:bg-white/5 text-black dark:text-white font-black uppercase tracking-[0.2em] text-sm flex items-center gap-3 group"
                    >
                      <Lock size={18} />
                      Industrial Access
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Social Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed left-6 bottom-20 z-50 hidden lg:flex flex-col items-center gap-5 after:content-[''] after:w-[1px] after:h-20 after:bg-gradient-to-b after:from-[#D4AF37] after:to-transparent"
      >
        <motion.a
          whileHover={{ y: -3, scale: 1.1 }}
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:text-[#D4AF37] transition-all"
        >
          <Facebook size={20} />
        </motion.a>
        <motion.a
          whileHover={{ y: -3, scale: 1.1 }}
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:text-[#D4AF37] transition-all"
        >
          <Instagram size={20} />
        </motion.a>
        <motion.a
          whileHover={{ y: -3, scale: 1.1 }}
          href="https://wa.me/94771234567"
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:text-green-500 transition-all"
        >
          <MessageCircle size={20} />
        </motion.a>
      </motion.div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed right-6 bottom-6 z-50 w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <ArrowRight size={20} className="rotate-[-90deg]" />
      </motion.button>

      <footer className="py-12 border-t border-gray-200 dark:border-white/5 text-center bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 dark:text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">
              Athukorala Traders (Pvt) Ltd
            </p>
            <p className="text-gray-400 dark:text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">
              © 2024 • Engineering Excellence Since 1998
            </p>
            <div className="flex gap-4">
              <span className="text-[10px] text-gray-500">Terms</span>
              <span className="text-[10px] text-gray-500">Privacy</span>
              <span className="text-[10px] text-gray-500">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const HeroPromotionShowcase = ({
  currentAnnouncement,
  promoAnnouncements,
  promoIndex,
  setPromoIndex,
  isUpcoming
}) => {
  const imageUrl = getAnnouncementImage(currentAnnouncement);

  if (!currentAnnouncement) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-[36px] border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/[0.04] backdrop-blur-2xl p-6 md:p-8 group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.10),transparent_35%)]" />
        <motion.div
          animate={{ x: ['-100%', '120%'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        />

        <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="text-left flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.28em] mb-4">
              <Megaphone size={13} />
              Promotion Space Ready
            </div>

            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight text-black dark:text-white">
              Your discount banner
              <span className="text-[#D4AF37]"> can appear here beautifully</span>
            </h3>

            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-4 max-w-2xl leading-relaxed">
              When you add a customer announcement, this section can show title, message,
              dates, and image in a premium hero layout.
            </p>
          </div>

          <div className="w-full lg:w-[320px] h-[220px] rounded-[24px] border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <ImageIcon size={40} className="mx-auto mb-3 text-[#D4AF37]" />
              <p className="text-xs uppercase tracking-[0.25em]">Image Preview Area</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={promoIndex}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.96 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        whileHover={{ y: -6 }}
        className={`relative overflow-hidden rounded-[36px] border backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${
          isUpcoming
            ? 'border-blue-500/25 bg-blue-500/[0.04]'
            : 'border-[#D4AF37]/25 bg-[linear-gradient(135deg,rgba(212,175,55,0.12),rgba(255,255,255,0.03))] dark:bg-[linear-gradient(135deg,rgba(212,175,55,0.12),rgba(255,255,255,0.03))]'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.14),transparent_28%)]" />

        <motion.div
          animate={{ x: ['-100%', '120%'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 h-[3px] w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        />

        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_50%)]" />
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-0 min-h-[320px] md:min-h-[350px]">
          <div className="p-6 md:p-8 lg:p-10 xl:p-12 text-left flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] ${
                  isUpcoming
                    ? 'border-blue-400/25 bg-blue-400/10 text-blue-300'
                    : 'border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]'
                }`}
              >
                {isUpcoming ? <Timer size={13} /> : <Flame size={13} />}
                {isUpcoming ? 'Upcoming Offer' : 'Live Promotion'}
              </motion.span>

              {currentAnnouncement?.urgent && (
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-[9px] font-black uppercase tracking-[0.28em]"
                >
                  Urgent
                </motion.span>
              )}
            </div>

            <motion.h3
              animate={
                !isUpcoming
                  ? {
                      textShadow: [
                        '0 0 0px rgba(212,175,55,0)',
                        '0 0 20px rgba(212,175,55,0.2)',
                        '0 0 0px rgba(212,175,55,0)'
                      ]
                    }
                  : {}
              }
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-[3.8rem] font-black uppercase tracking-tight leading-[1.1] text-black dark:text-white"
            >
              {currentAnnouncement.title}
            </motion.h3>

            <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 mt-4 leading-relaxed max-w-3xl">
              {currentAnnouncement.message}
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <MetaPill
                icon={<CalendarDays size={13} />}
                text={`Starts: ${formatDate(currentAnnouncement.startDate)}`}
              />
              <MetaPill
                icon={<Clock size={13} />}
                text={`Ends: ${formatDate(currentAnnouncement.expiryDate)}`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-6">
              <Link to="/auth?mode=customer">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isUpcoming}
                  className={`px-8 py-4 rounded-2xl font-black uppercase tracking-[0.18em] text-xs flex items-center justify-center gap-3 transition-all ${
                    isUpcoming
                      ? 'bg-gray-100 dark:bg-white/5 text-gray-500 border border-gray-200 dark:border-white/10 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#D4AF37] to-[#B8960F] text-black hover:shadow-xl'
                  }`}
                >
                  {isUpcoming ? 'Coming Soon' : 'View Offer'}
                  {!isUpcoming && <ArrowRight size={16} />}
                </motion.button>
              </Link>

              {promoAnnouncements.length > 1 && (
                <div className="flex items-center gap-2">
                  {promoAnnouncements.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPromoIndex(i)}
                      className={`rounded-full transition-all duration-500 ${
                        i === promoIndex ? 'w-10 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-gray-400 dark:bg-white/20 hover:bg-[#D4AF37]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative min-h-[240px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-white/10 overflow-hidden">
            {imageUrl ? (
              <>
                <motion.img
                  key={imageUrl}
                  initial={{ scale: 1.1, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  src={imageUrl}
                  alt={currentAnnouncement?.title || 'Promotion'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.15),transparent_45%)]" />
              </>
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.1),rgba(255,255,255,0.02))] flex items-center justify-center">
                <div className="text-center px-6">
                  <ImageIcon size={48} className="mx-auto mb-4 text-[#D4AF37] animate-pulse" />
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                    Promotion Image
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Add imageUrl in your announcement
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-4"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black mb-1.5">
                  Featured Campaign
                </p>
                <p className="text-sm text-white font-semibold line-clamp-2">
                  {currentAnnouncement.title}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const getAnnouncementImage = (announcement) => {
  if (!announcement) return '';
  return announcement.imageUrl || announcement.image || announcement.photoUrl || announcement.bannerUrl || announcement.imagePath || '';
};

const MiniChip = ({ icon, text }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
    }}
    whileHover={{ y: -3, borderColor: 'rgba(212,175,55,0.4)' }}
    className="px-4 py-2.5 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 backdrop-blur-xl flex items-center gap-2 text-xs text-gray-800 dark:text-gray-200"
  >
    <span className="text-[#D4AF37]">{icon}</span>
    <span>{text}</span>
  </motion.div>
);

const MetaPill = ({ icon, text }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-xs text-gray-800 dark:text-gray-300">
    <span className="text-[#D4AF37]">{icon}</span>
    <span>{text}</span>
  </div>
);

const PremiumBadge = ({ icon, text }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
    }}
    whileHover={{ y: -4, borderColor: 'rgba(212,175,55,0.4)', scale: 1.02 }}
    className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 backdrop-blur-xl flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200"
  >
    <span className="text-[#D4AF37]">{icon}</span>
    <span>{text}</span>
  </motion.div>
);

const FeatureCard = ({ icon, title, text, delay }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: delay * 0.1 } }
    }}
    whileHover={{ y: -12, borderColor: 'rgba(212,175,55,0.5)', scale: 1.02 }}
    className="rounded-[28px] border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 backdrop-blur-xl p-8 group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-all" />
    <motion.div
      whileHover={{ rotate: 10, scale: 1.1 }}
      className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-6 relative z-10"
    >
      {icon}
    </motion.div>
    <h3 className="text-2xl font-black tracking-tight mb-4 text-black dark:text-white relative z-10">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10">{text}</p>
    <motion.div
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent origin-left"
    />
  </motion.div>
);

const CategoryCard = ({ icon, title, count, description, delay }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: delay * 0.1 } }
    }}
    whileHover={{
      backgroundColor: 'rgba(212, 175, 55, 0.08)',
      borderColor: 'rgba(212, 175, 55, 0.5)',
      y: -12
    }}
    className="p-8 md:p-10 rounded-[28px] border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-[#0a0a0a] group cursor-pointer relative overflow-hidden transition-all"
  >
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <motion.div
      whileHover={{ rotate: 360, scale: 1.15 }}
      transition={{ duration: 0.5 }}
      className="text-[#D4AF37] mb-6"
    >
      {icon}
    </motion.div>
    <p className="text-3xl font-black mb-2 tracking-tighter text-black dark:text-white group-hover:text-[#D4AF37] transition-colors">
      {count}
    </p>
    <h3 className="text-sm uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
      {title}
    </h3>
    <p className="text-xs text-gray-400">{description}</p>
  </motion.div>
);

const ContactLink = ({ icon, label, val, isLink }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: -25 },
      show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    }}
    whileHover={{ x: 10 }}
    className="flex items-center gap-5 group cursor-pointer"
  >
    <motion.div
      whileHover={{ rotate: 360, scale: 1.1 }}
      className="w-14 h-14 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all"
    >
      {icon}
    </motion.div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
        {label}
      </p>
      <p
        className={`text-lg md:text-xl font-medium text-black dark:text-white ${
          isLink ? 'underline decoration-[#D4AF37]/30 group-hover:text-[#D4AF37]' : ''
        } transition-colors`}
      >
        {val}
      </p>
    </div>
  </motion.div>
);

const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default LandingPage;