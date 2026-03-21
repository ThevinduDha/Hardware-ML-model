import React from 'react';
import { Hammer } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#121212]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <Hammer className="text-[#D4AF37] group-hover:rotate-12 transition-transform" size={28} />
          <span className="text-xl font-bold tracking-tighter text-white uppercase">
            Athukorala <span className="text-[#D4AF37]">Traders</span>
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest">
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Home</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Inventory</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">Promotions</a>
          <a href="#" className="hover:text-[#D4AF37] transition-colors">About</a>
        </div>

        {/* Action Button */}
        <button className="bg-[#D4AF37] text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-white transition-all transform hover:scale-105">
          STAFF LOGIN
        </button>
      </div>
    </nav>
  );
};

export default Navbar;