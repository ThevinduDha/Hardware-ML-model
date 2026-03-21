import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Hammer, ShieldCheck, Terminal, Cpu, Lock } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const PortalPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onPortalLogin = async (data) => {
    const loading = toast.loading("Verifying Credentials...");
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && (result.role === 'ADMIN' || result.role === 'STAFF')) {
        toast.success(`Access Granted: ${result.role} Session Active`, { id: loading });
        localStorage.setItem("token", result.token);
        // Redirect to Dashboard
      } else {
        toast.error("Access Denied: Restricted to Authorized Personnel Only.", { id: loading });
      }
    } catch (error) {
      toast.error("Database Connection Failure.", { id: loading });
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="bottom-center" />
      
      {/* Industrial Grid Background */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-[#0a0a0a] border border-white/5 p-10 relative shadow-2xl">
          {/* Top Decorative Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/20 mb-6">
              <ShieldCheck className="text-[#D4AF37]" size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-[0.3em] uppercase mb-2">Internal <span className="text-[#D4AF37]">Portal</span></h1>
            <p className="text-[10px] text-gray-600 tracking-widest uppercase font-bold">Athukorala Traders • Management Layer</p>
          </div>

          <form onSubmit={handleSubmit(onPortalLogin)} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Staff Identifier</label>
              <div className="relative">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/40" size={16} />
                <input 
                  {...register("email", { required: true })}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 focus:border-[#D4AF37] outline-none transition-all text-sm font-mono"
                  placeholder="name@athukorala.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/40" size={16} />
                <input 
                  type="password"
                  {...register("password", { required: true })}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 focus:border-[#D4AF37] outline-none transition-all text-sm font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button className="w-full bg-transparent border border-[#D4AF37] text-[#D4AF37] py-4 font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 mt-4 text-xs">
              Execute Login
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between opacity-30">
            <div className="flex items-center gap-2">
              <Cpu size={14} />
              <span className="text-[8px] uppercase tracking-tighter">System: v2.0.4-Secure</span>
            </div>
            <span className="text-[8px] uppercase tracking-tighter">Encrypted-Session-Active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PortalPage;