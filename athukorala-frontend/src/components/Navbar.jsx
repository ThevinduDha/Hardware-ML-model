import React from 'react';
import { Hammer, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <Hammer className="text-[#D4AF37] group-hover:rotate-12 transition-transform" size={24} />
          <span className="text-lg font-black tracking-tighter text-white uppercase">
            Athukorala <span className="text-[#D4AF37]">Traders</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 border-r border-white/10 pr-6 mr-2">
            <a href="https://facebook.com/..." target="_blank" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Facebook size={18} /></a>
            <a href="https://instagram.com/..." target="_blank" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><Instagram size={18} /></a>
          </div>
          
          {/* Industry Standard: Change to 'Sign In' for Customers */}
          <Link to="/login">
            <button className="bg-[#D4AF37] text-black px-8 py-2 rounded-none font-black text-xs tracking-[0.2em] uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              SIGN IN
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;