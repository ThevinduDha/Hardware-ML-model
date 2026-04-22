import React, { useState, useEffect } from 'react';
import { Hammer, Facebook, Instagram, LayoutDashboard, LogOut, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Protocol: Check for existing session
  const user = JSON.parse(localStorage.getItem("user") || 'null');

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("SESSION TERMINATED: SECURE LOGOUT COMPLETE");
    navigate("/login");
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer decoration-none">
          <Hammer className="text-[#D4AF37] group-hover:rotate-12 transition-transform" size={24} />
          <span className="text-lg font-black tracking-tighter text-black dark:text-white uppercase">
            Athukorala <span className="text-[#D4AF37]">Traders</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {/* THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun size={18} className="transition-transform duration-300 rotate-0 dark:rotate-180" />
            ) : (
              <Moon size={18} className="transition-transform duration-300" />
            )}
          </button>

          {/* SOCIAL LINKS */}
          <div className="hidden md:flex gap-4 border-r border-gray-200 dark:border-white/10 pr-6 mr-2">
            <a href="#" target="_blank" className="text-gray-500 dark:text-gray-400 hover:text-[#D4AF37] transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" target="_blank" className="text-gray-500 dark:text-gray-400 hover:text-[#D4AF37] transition-colors">
              <Instagram size={18} />
            </a>
          </div>
          
          {/* AUTHENTICATION LOGIC */}
          {user ? (
            <div className="flex items-center gap-4">
              {/* DASHBOARD LINK (DYNAMIC BASED ON ROLE) */}
              <Link 
                to={user.role === 'ADMIN' ? "/admin-dashboard" : "/customer-dashboard"}
                className="flex items-center gap-2 text-[10px] font-black text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] uppercase tracking-widest transition-all group"
              >
                <LayoutDashboard size={14} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Command Center</span>
              </Link>

              {/* USER PROFILE SHORTCUT */}
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-[#D4AF37]/50 transition-all">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
                  {user.name.split(' ')[0]}
                </span>
              </Link>

              {/* LOGOUT BUTTON */}
              <button 
                onClick={handleLogout}
                className="text-gray-500 dark:text-gray-500 hover:text-red-500 transition-colors p-1"
                title="Terminate Session"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            /* SIGN IN BUTTON (GUEST STATE) */
            <Link to="/login">
              <button className="bg-[#D4AF37] text-black px-8 py-2 rounded-none font-black text-xs tracking-[0.2em] uppercase hover:bg-white dark:hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                SIGN IN
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;