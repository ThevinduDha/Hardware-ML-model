import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
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
  CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import heroImg from '../assets/hero.png';

const LandingPage = () => {
  const { scrollY } = useScroll();

  const yHero = useTransform(scrollY, [0, 500], [0, 160]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0.75]);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 8) + 6,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: Math.random() * 8 + 7
      })),
    []
  );

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, ease: 'easeOut' }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#D4AF37] selection:text-black overflow-x-hidden font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.18, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.34 }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url(${heroImg})`,
            y: yHero,
            opacity: opacityHero
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-[#050505] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_35%)] z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 z-10" />

        {/* Glow Effects */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-[320px] h-[320px] bg-[#D4AF37]/10 rounded-full blur-[120px] z-10"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 35, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 w-[360px] h-[360px] bg-yellow-500/10 rounded-full blur-[130px] z-10"
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full bg-[#D4AF37]/25"
              style={{
                width: particle.size,
                height: particle.size,
                top: particle.top,
                left: particle.left
              }}
              animate={{
                y: [0, -22, 0],
                opacity: [0.15, 0.7, 0.15],
                scale: [1, 1.25, 1]
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

        {/* Hero Content */}
        <motion.div
          style={{ y: yHero }}
          className="relative z-20 text-center px-6 max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-8 flex-wrap"
          >
            <div className="h-[1px] w-12 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold tracking-[0.45em] text-[11px] uppercase">
              Premium Hardware Solutions
            </span>
            <div className="h-[1px] w-12 bg-[#D4AF37]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black mb-3 tracking-tighter leading-none"
          >
            ATHUKORALA
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.9 }}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light italic text-[#D4AF37] tracking-tight mb-8"
          >
            Traders (Pvt) Ltd.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed mb-10"
          >
            Industrial-grade tools, electrical supplies, plumbing solutions, and premium
            coatings — delivered with trust, quality, and modern service excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <PremiumBadge icon={<ShieldCheck size={16} />} text="Trusted Quality" />
            <PremiumBadge icon={<Truck size={16} />} text="Fast Supply" />
            <PremiumBadge icon={<Factory size={16} />} text="Industrial Grade" />
            <PremiumBadge icon={<Sparkles size={16} />} text="Premium Experience" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link to="/auth?mode=admin">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 0 35px rgba(212,175,55,0.2)'
                }}
                whileTap={{ scale: 0.96 }}
                className="group relative px-8 sm:px-10 py-5 rounded-2xl border border-[#D4AF37] text-[#D4AF37] font-bold overflow-hidden transition-all hover:text-black min-w-[260px] bg-black/20 backdrop-blur-xl"
              >
                <span className="relative z-10 tracking-[0.26em] uppercase flex items-center justify-center gap-3 text-sm">
                  <Lock size={18} /> Industrial Access
                </span>
                <div className="absolute inset-0 bg-[#D4AF37] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              </motion.button>
            </Link>

            <Link to="/auth?mode=customer">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  borderColor: 'rgba(212,175,55,0.45)'
                }}
                whileTap={{ scale: 0.96 }}
                className="group relative px-8 sm:px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold overflow-hidden transition-all min-w-[260px] backdrop-blur-xl"
              >
                <span className="relative z-10 tracking-[0.26em] uppercase flex items-center justify-center gap-3 text-sm">
                  <User size={18} /> Client Portal
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.9 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-4xl mx-auto"
          >
            <HeroStat value="10K+" label="Products Available" />
            <HeroStat value="25+" label="Top Brands" />
            <HeroStat value="1998" label="Trusted Since" />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-[#D4AF37]/60"
        >
          <ChevronDown size={20} className="mx-auto mb-1" />
          <div className="w-[1px] h-14 bg-gradient-to-b from-[#D4AF37] to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* BRAND MARQUEE */}
      <section className="py-10 bg-[#0a0a0a] border-y border-white/5 overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          {[
            'LANKATILES',
            'NIPPON PAINT',
            'STANLEY',
            'SIERRA CABLES',
            'ORANGE ELECTRIC',
            'LANKATILES',
            'NIPPON PAINT',
            'STANLEY'
          ].map((brand, index) => (
            <span
              key={index}
              className={`text-4xl font-black mx-10 uppercase tracking-tighter ${
                index % 2 === 0 ? 'text-white/10' : 'text-[#D4AF37]/20'
              }`}
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4">
            Why Choose Us
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Built for Reliability
          </h2>
          <p className="text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            From home projects to industrial operations, we supply dependable materials
            with consistent quality and service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<ShieldCheck size={28} />}
            title="Trusted Products"
            text="We provide quality materials and dependable brands for long-term performance."
            delay={0.1}
          />
          <FeatureCard
            icon={<Truck size={28} />}
            title="Fast Service"
            text="Quick response, smooth purchasing experience, and customer-focused support."
            delay={0.2}
          />
          <FeatureCard
            icon={<Star size={28} />}
            title="Premium Experience"
            text="A modern, premium service approach with stronger visual identity and trust."
            delay={0.3}
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="mb-14 text-center">
          <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4">
            Our Categories
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Core Product Lines
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <CategoryCard icon={<Construction size={32} />} title="Industrial Tools" count="1.2k+" delay={0.1} />
          <CategoryCard icon={<Zap size={32} />} title="Electrical" count="850+" delay={0.2} />
          <CategoryCard icon={<Droplets size={32} />} title="Plumbing" count="2.1k+" delay={0.3} />
          <CategoryCard icon={<PaintBucket size={32} />} title="Paints & Coatings" count="400+" delay={0.4} />
        </div>
      </section>

      {/* PROMO STRIP */}
      <section className="px-6 pb-10">
        <motion.div
          {...fadeInUp}
          className="max-w-7xl mx-auto rounded-[30px] border border-[#D4AF37]/20 bg-[linear-gradient(135deg,rgba(212,175,55,0.10),rgba(255,255,255,0.03))] backdrop-blur-xl p-8 md:p-10 overflow-hidden relative"
        >
          <motion.div
            animate={{ x: ['-100%', '120%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <p className="text-[#D4AF37] text-xs uppercase tracking-[0.35em] mb-4">
                Premium Supply Network
              </p>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight">
                Hardware Solutions
                <span className="text-[#D4AF37]"> For Modern Projects</span>
              </h3>
              <p className="text-gray-300 mt-5 max-w-2xl leading-relaxed">
                Discover premium tools, trusted electrical products, plumbing materials,
                and coatings built for homes, businesses, and industrial workspaces.
              </p>
            </div>

            <div className="flex lg:justify-end">
              <Link to="/auth?mode=customer">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group px-8 py-4 rounded-2xl bg-[#D4AF37] text-black font-black uppercase tracking-[0.2em] flex items-center gap-3"
                >
                  Explore Portal
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HEADQUARTERS */}
      <section className="py-28 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(212,175,55,0.08),transparent_30%)]" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4">
              Visit Us
            </p>
            <h2 className="text-4xl md:text-6xl font-black mb-12 uppercase tracking-tighter leading-tight">
              Pitigala
              <br />
              <span className="text-[#D4AF37]">Headquarters</span>
            </h2>

            <div className="space-y-8">
              <ContactLink icon={<MapPin />} label="Location" val="New Town, Pitigala, Sri Lanka" />
              <ContactLink icon={<Phone />} label="Hotline" val="0912 291 126" />
              <ContactLink icon={<ExternalLink />} label="Directions" val="View on Google Maps" isLink />
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="mt-10 p-5 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-start gap-4"
            >
              <CheckCircle2 className="text-[#D4AF37] mt-1" size={18} />
              <p className="text-sm text-gray-300 leading-relaxed">
                Trusted by customers looking for strong materials, dependable service,
                and premium product sourcing for real projects.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[30px] backdrop-blur-xl relative overflow-hidden group shadow-[0_20px_70px_rgba(0,0,0,0.28)]"
          >
            <div className="absolute top-0 right-0 p-8 text-[#D4AF37]/5 group-hover:text-[#D4AF37]/10 transition-colors">
              <Clock size={120} />
            </div>

            <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-8 text-[#D4AF37]">
              Operation Hours
            </h3>

            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div
                  key={day}
                  className="flex justify-between items-center border-b border-white/5 pb-3"
                >
                  <span className="text-gray-400 font-light">{day}</span>
                  <span className="font-mono text-sm tracking-tight">
                    08:00 AM – 05:30 PM
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-black uppercase text-[#D4AF37] tracking-[0.15em]">
                Pitigala Branch is Currently Open
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6">
        <motion.div
          {...fadeInUp}
          className="max-w-6xl mx-auto text-center rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl px-6 md:px-12 py-14 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_45%)]" />
          <p className="relative z-10 text-[#D4AF37] text-xs uppercase tracking-[0.4em] mb-4">
            Start Now
          </p>
          <h2 className="relative z-10 text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
            Enter The Premium
            <span className="text-[#D4AF37]"> Hardware Experience</span>
          </h2>
          <p className="relative z-10 text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Access the customer portal or secure industrial portal to explore products,
            services, and premium business operations.
          </p>

          <div className="relative z-10 mt-10 flex flex-wrap justify-center gap-5">
            <Link to="/auth?mode=customer">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl bg-[#D4AF37] text-black font-black uppercase tracking-[0.2em]"
              >
                Client Portal
              </motion.button>
            </Link>

            <Link to="/auth?mode=admin">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl border border-white/15 bg-white/5 text-white font-black uppercase tracking-[0.2em]"
              >
                Industrial Access
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FLOATING SOCIAL BAR */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8 }}
        className="fixed left-6 bottom-0 z-50 hidden lg:flex flex-col items-center gap-6 after:content-[''] after:w-[1px] after:h-24 after:bg-[#D4AF37]/30"
      >
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:text-[#D4AF37] hover:-translate-y-1 transition-all"
        >
          <Facebook size={20} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="text-gray-500 hover:text-[#D4AF37] hover:-translate-y-1 transition-all"
        >
          <Instagram size={20} />
        </a>
      </motion.div>

      <footer className="py-16 border-t border-white/5 text-center">
        <p className="text-gray-700 text-[10px] uppercase tracking-[0.7em] font-bold px-4">
          Athukorala Traders (Pvt) Ltd • Engineering Excellence Since 1998
        </p>
      </footer>
    </div>
  );
};

const PremiumBadge = ({ icon, text }) => (
  <div className="px-4 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center gap-3 text-sm text-gray-200">
    <span className="text-[#D4AF37]">{icon}</span>
    <span>{text}</span>
  </div>
);

const HeroStat = ({ value, label }) => (
  <motion.div
    whileHover={{ y: -5, borderColor: 'rgba(212,175,55,0.35)' }}
    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
  >
    <p className="text-3xl md:text-4xl font-black text-[#D4AF37] tracking-tight">{value}</p>
    <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mt-2">{label}</p>
  </motion.div>
);

const FeatureCard = ({ icon, title, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.75 }}
    whileHover={{ y: -8, borderColor: 'rgba(212,175,55,0.4)' }}
    className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8"
  >
    <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold tracking-tight mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{text}</p>
  </motion.div>
);

const CategoryCard = ({ icon, title, count, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{
      backgroundColor: 'rgba(212, 175, 55, 0.05)',
      borderColor: 'rgba(212, 175, 55, 0.4)',
      y: -10
    }}
    className="p-8 md:p-10 rounded-[28px] border border-white/5 bg-[#0a0a0a] group cursor-pointer relative overflow-hidden transition-all"
  >
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <p className="text-3xl font-black mb-2 tracking-tighter group-hover:text-[#D4AF37] transition-colors">
      {count}
    </p>
    <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
      {title}
    </h3>
  </motion.div>
);

const ContactLink = ({ icon, label, val, isLink }) => (
  <motion.div whileHover={{ x: 8 }} className="flex items-center gap-5 group cursor-pointer">
    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
        {label}
      </p>
      <p
        className={`text-lg md:text-xl font-medium ${
          isLink ? 'underline decoration-[#D4AF37]/30 group-hover:text-[#D4AF37]' : ''
        } transition-colors`}
      >
        {val}
      </p>
    </div>
  </motion.div>
);

export default LandingPage;