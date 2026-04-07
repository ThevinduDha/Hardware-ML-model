import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Database,
  Shield,
  Bell,
  HardDrive
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 }
  }
};

const SystemConfig = () => {
  const [config, setConfig] = useState({
    systemName: 'ATHUKORALA INDUSTRIAL',
    lowStockThreshold: 10,
    maintenanceMode: false,
    autoBackup: true,
    currency: 'LKR'
  });

  const [errors, setErrors] = useState({
    systemName: '',
    lowStockThreshold: '',
    currency: ''
  });

  useEffect(() => {
    toast('SYSTEM CONFIG ACCESS GRANTED', {
      icon: '🔐'
    });
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'systemName': {
        const trimmed = String(value).trim();
        if (!trimmed) return 'System name is required';
        if (trimmed.length < 3) return 'System name must be at least 3 characters';
        return '';
      }

      case 'currency': {
        const trimmed = String(value).trim().toUpperCase();
        if (!trimmed) return 'Currency is required';
        if (!/^[A-Z]{3}$/.test(trimmed)) return 'Currency must be exactly 3 letters';
        return '';
      }

      case 'lowStockThreshold': {
        const strValue = String(value).trim();
        if (!strValue) return 'Low stock threshold is required';
        if (!/^\d+$/.test(strValue)) return 'Threshold must be a whole number';

        const num = Number(strValue);
        if (num < 1) return 'Threshold must be at least 1';
        if (num > 1000) return 'Threshold must be 1000 or less';
        return '';
      }

      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {
      systemName: validateField('systemName', config.systemName),
      currency: validateField('currency', config.currency),
      lowStockThreshold: validateField('lowStockThreshold', config.lowStockThreshold)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSave = () => {
    if (!validateAll()) {
      toast.error('Please fix the validation errors first');
      return;
    }

    const loading = toast.loading('Saving...');

    setTimeout(() => {
      toast.success('Configuration Updated', { id: loading });
    }, 1200);
  };

  const handleSystemNameChange = (value) => {
    setConfig((prev) => ({
      ...prev,
      systemName: value.toUpperCase()
    }));

    setErrors((prev) => ({
      ...prev,
      systemName: validateField('systemName', value)
    }));
  };

  const handleCurrencyChange = (value) => {
    const cleaned = value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);

    setConfig((prev) => ({
      ...prev,
      currency: cleaned
    }));

    setErrors((prev) => ({
      ...prev,
      currency: validateField('currency', cleaned)
    }));
  };

  const handleThresholdChange = (value) => {
    const cleaned = value.replace(/[^\d]/g, '');

    setConfig((prev) => ({
      ...prev,
      lowStockThreshold: cleaned
    }));

    setErrors((prev) => ({
      ...prev,
      lowStockThreshold: validateField('lowStockThreshold', cleaned)
    }));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* HEADER */}
      <motion.div
        variants={itemVariants}
        className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
          System Control
        </p>
        <h2 className="text-3xl font-black text-white">
          Configuration Panel
        </h2>
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* GLOBAL */}
        <motion.div
          variants={itemVariants}
          className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 space-y-6"
        >
          <h3 className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] flex items-center gap-2">
            <Shield size={14} /> Global Settings
          </h3>

          <InputBox
            label="System Name"
            value={config.systemName}
            onChange={handleSystemNameChange}
            error={errors.systemName}
            placeholder="Enter system name"
          />

          <InputBox
            label="Currency"
            value={config.currency}
            onChange={handleCurrencyChange}
            error={errors.currency}
            placeholder="e.g. LKR"
            maxLength={3}
          />

          <ToggleBox
            label="Maintenance Mode"
            desc="Enable or disable maintenance protocol"
            active={config.maintenanceMode}
            onClick={() =>
              setConfig((prev) => ({
                ...prev,
                maintenanceMode: !prev.maintenanceMode
              }))
            }
          />
        </motion.div>

        {/* THRESHOLD */}
        <motion.div
          variants={itemVariants}
          className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 space-y-6"
        >
          <h3 className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] flex items-center gap-2">
            <Database size={14} /> System Rules
          </h3>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <label className="text-xs uppercase tracking-[0.18em] text-gray-400 flex items-center gap-2">
              <Bell size={12} className="text-[#D4AF37]" />
              Low Stock Threshold
            </label>

            <input
              type="text"
              inputMode="numeric"
              value={config.lowStockThreshold}
              onChange={(e) => handleThresholdChange(e.target.value)}
              className={`w-full mt-3 p-3 bg-black/40 border rounded-xl text-white outline-none transition ${
                errors.lowStockThreshold
                  ? 'border-red-500/70 focus:border-red-500'
                  : 'border-white/10 focus:border-[#D4AF37]'
              }`}
              placeholder="Enter threshold"
            />

            {errors.lowStockThreshold && (
              <p className="text-xs text-red-400 mt-2">{errors.lowStockThreshold}</p>
            )}
          </div>

          <ToggleBox
            label="Auto Backup"
            desc="Enable automatic registry backup"
            active={config.autoBackup}
            onClick={() =>
              setConfig((prev) => ({
                ...prev,
                autoBackup: !prev.autoBackup
              }))
            }
          />

          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-[0.15em]">
            <HardDrive size={14} />
            Database Node: localhost:3306
          </div>
        </motion.div>
      </div>

      {/* SAVE BUTTON */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-10 py-4 bg-[#D4AF37] text-black font-bold rounded-2xl hover:bg-white transition"
        >
          <Save size={16} />
          Save Configuration
        </button>

        <p className="text-xs text-gray-500 uppercase tracking-[0.15em]">
          Changes apply to global business rules
        </p>
      </motion.div>
    </motion.div>
  );
};

const InputBox = ({
  label,
  value,
  onChange,
  error,
  placeholder = '',
  maxLength
}) => (
  <div>
    <label className="text-xs uppercase tracking-[0.18em] text-gray-400">
      {label}
    </label>

    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full mt-2 p-3 bg-black/40 border rounded-xl text-white outline-none transition ${
        error
          ? 'border-red-500/70 focus:border-red-500'
          : 'border-white/10 focus:border-[#D4AF37]'
      }`}
    />

    {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
  </div>
);

const ToggleBox = ({ label, desc, active, onClick }) => (
  <div className="flex justify-between items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>

    <button
      type="button"
      onClick={onClick}
      className={`relative w-14 h-8 rounded-full transition ${
        active ? 'bg-[#D4AF37]' : 'bg-gray-700'
      }`}
    >
      <motion.div
        animate={{ x: active ? 24 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
      />
    </button>
  </div>
);

export default SystemConfig;