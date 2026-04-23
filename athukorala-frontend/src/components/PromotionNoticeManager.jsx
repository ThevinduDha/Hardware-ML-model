import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone,
  Send,
  AlertTriangle,
  Eye,
  Clock,
  Calendar,
  Loader2,
  Image as ImageIcon,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';

const containerVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      staggerChildren: 0.06
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
};

const PromotionNoticeManager = ({
  editingNotice = null,
  onCancelEdit = () => {},
  onSuccess = () => {},
  mode = 'promotion' // promotion | announcement
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [isDeploying, setIsDeploying] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  // Validation tracking
  const [touched, setTouched] = useState({
    title: false,
    message: false,
    startDate: false,
    expiryDate: false
  });

  const [errors, setErrors] = useState({
    title: null,
    message: null,
    startDate: null,
    expiryDate: null
  });

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    startDate: today,
    expiryDate: '',
    urgent: false
  });

  const pageMeta =
    mode === 'announcement'
      ? {
          badge: 'BROADCAST HUB',
          title: 'Announcements Center',
          subtitle: 'Manage staff notices, promotions, and communication streams.',
          panelBadge: 'INTERNAL STAFF PROTOCOL',
          formTitle: 'Staff Broadcast Protocol',
          formDesc: 'Create and publish internal communication notices with premium registry styling.',
          imageTitle: 'Notice Image',
          imageDesc: 'Upload, replace, or remove the banner image used for the notice preview.',
          titleLabel: 'NOTICE DESIGNATION',
          titlePlaceholder: 'E.G. EMERGENCY WAREHOUSE AUDIT',
          messageLabel: 'OPERATIONAL INSTRUCTIONS',
          messagePlaceholder: 'ENTER FULL DETAILS AND REQUIRED STAFF ACTIONS...',
          primaryButton: editingNotice ? 'Update Notice' : 'Initialize Broadcast',
          loadingText: editingNotice ? 'Updating Notice...' : 'Publishing Notice...',
          noteTitle: 'Transmission Note',
          noteText:
            'The uploaded image will be stored in Cloudinary and linked to this notice record during deployment.',
          previewTitle: 'Live Notice Preview',
          previewSubtitle: 'How the broadcast may appear inside the system',
          priorityOn: 'HIGH PRIORITY ACTIVE',
          priorityOff: 'NORMAL PRIORITY',
          targetRole: 'STAFF'
        }
      : {
          badge: 'PROMOTIONS & DEALS',
          title: 'Promotion Registry',
          subtitle: 'Create, update, and monitor customer-facing campaigns.',
          panelBadge: 'PROMOTION COMMAND',
          formTitle: 'Customer Announcement Registry',
          formDesc: 'Create and publish customer campaigns with the same premium system styling.',
          imageTitle: 'Promotion Image',
          imageDesc: 'Upload, replace, or remove the campaign image.',
          titleLabel: 'PROMOTION TITLE',
          titlePlaceholder: 'E.G. APRIL MEGA DISCOUNT',
          messageLabel: 'MESSAGE',
          messagePlaceholder: 'ENTER THE CAMPAIGN MESSAGE SHOWN TO CUSTOMERS...',
          primaryButton: editingNotice ? 'Update Promotion' : 'Publish Promotion',
          loadingText: editingNotice ? 'Updating Promotion...' : 'Publishing Promotion...',
          noteTitle: 'Deployment Note',
          noteText:
            'The uploaded image will be stored in Cloudinary and the returned URL will be saved with this notice record.',
          previewTitle: 'Live Preview',
          previewSubtitle: 'How it may appear to customers',
          priorityOn: 'HIGH PRIORITY ACTIVE',
          priorityOff: 'NORMAL PRIORITY',
          targetRole: 'CUSTOMER'
        };

  // Validation functions
  const validateField = (name, value, formState = formData) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return `${pageMeta.titleLabel} IS MANDATORY`;
        if (value.trim().length < 5) return `${pageMeta.titleLabel} MUST BE AT LEAST 5 CHARACTERS`;
        if (value.trim().length > 100) return `${pageMeta.titleLabel} MUST NOT EXCEED 100 CHARACTERS`;
        return null;
      
      case 'message':
        if (!value.trim()) return `${pageMeta.messageLabel} IS MANDATORY`;
        if (value.trim().length < 10) return `${pageMeta.messageLabel} MUST BE AT LEAST 10 CHARACTERS`;
        if (value.trim().length > 1000) return `${pageMeta.messageLabel} MUST NOT EXCEED 1000 CHARACTERS`;
        return null;
      
      case 'startDate':
        if (!value) return 'START DATE IS MANDATORY';
        const startDate = new Date(value);
        const todayDate = new Date(today);
        todayDate.setHours(0, 0, 0, 0);
        if (startDate < todayDate) return 'START DATE CANNOT BE IN THE PAST';
        return null;
      
      case 'expiryDate':
        if (!value) return 'EXPIRY DATE IS MANDATORY';
        const expiryDate = new Date(value);
        const startDateVal = new Date(formState.startDate);
        if (formState.startDate && expiryDate <= startDateVal) {
          return 'EXPIRY DATE MUST BE AFTER START DATE';
        }
        return null;
      
      default:
        return null;
    }
  };

  const validateAllFields = () => {
    const newErrors = {
      title: validateField('title', formData.title),
      message: validateField('message', formData.message),
      startDate: validateField('startDate', formData.startDate),
      expiryDate: validateField('expiryDate', formData.expiryDate, formData)
    };
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Validate on change after field has been touched
    if (touched[name]) {
      const error = validateField(name, value, newFormData);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value, formData);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    if (editingNotice) {
      setFormData({
        title: editingNotice.title || '',
        message: editingNotice.message || '',
        startDate: editingNotice.startDate || today,
        expiryDate: editingNotice.expiryDate || '',
        urgent: editingNotice.urgent || false
      });
      setImageUrl(editingNotice.imageUrl || '');
      // Mark all fields as touched when editing
      setTouched({
        title: true,
        message: true,
        startDate: true,
        expiryDate: true
      });
      // Validate all fields on load
      setTimeout(() => {
        setErrors({
          title: validateField('title', editingNotice.title || ''),
          message: validateField('message', editingNotice.message || ''),
          startDate: validateField('startDate', editingNotice.startDate || today),
          expiryDate: validateField('expiryDate', editingNotice.expiryDate || '', {
            startDate: editingNotice.startDate || today
          })
        });
      }, 0);
    } else {
      setFormData({
        title: '',
        message: '',
        startDate: today,
        expiryDate: '',
        urgent: false
      });
      setImageUrl('');
      setTouched({
        title: false,
        message: false,
        startDate: false,
        expiryDate: false
      });
      setErrors({
        title: null,
        message: null,
        startDate: null,
        expiryDate: null
      });
    }
  }, [editingNotice, today]);

  const isUpcoming =
    formData.startDate && new Date(formData.startDate) > new Date(today);

  const canPreview = useMemo(() => {
    return (
      formData.title.trim() ||
      formData.message.trim() ||
      formData.expiryDate ||
      imageUrl
    );
  }, [formData, imageUrl]);

  const validateProtocol = () => {
    // Mark all fields as touched
    setTouched({
      title: true,
      message: true,
      startDate: true,
      expiryDate: true
    });
    
    const isValid = validateAllFields();
    
    if (!isValid) {
      const errorMessages = Object.values(errors).filter(e => e !== null);
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0], {
          icon: '⚠️',
          style: {
            borderRadius: '14px',
            background: '#050505',
            color: '#ff4444',
            border: '1px solid #ff4444',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.1em'
          }
        });
      }
      return false;
    }
    
    return true;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      startDate: today,
      expiryDate: '',
      urgent: false
    });
    setImageUrl('');
    setShowPreview(true);
    setTouched({
      title: false,
      message: false,
      startDate: false,
      expiryDate: false
    });
    setErrors({
      title: null,
      message: null,
      startDate: null,
      expiryDate: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProtocol() || isDeploying) return;

    setIsDeploying(true);
    const loading = toast.loading(
      editingNotice ? pageMeta.loadingText : pageMeta.loadingText
    );

    try {
      const url = editingNotice
        ? `http://localhost:8080/api/notices/${editingNotice.id}`
        : 'http://localhost:8080/api/notices/publish';

      const method = editingNotice ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          message: formData.message.trim(),
          startDate: formData.startDate,
          expiryDate: formData.expiryDate,
          urgent: formData.urgent,
          active: true,
          targetRole: pageMeta.targetRole,
          imageUrl: imageUrl
        })
      });

      if (res.ok) {
        toast.success(
          editingNotice
            ? `${mode === 'announcement' ? 'NOTICE' : 'PROMOTION'} UPDATED SUCCESSFULLY`
            : `${mode === 'announcement' ? 'NOTICE' : 'PROMOTION'} PUBLISHED SUCCESSFULLY`,
          {
            id: loading,
            style: {
              border: '1px solid #D4AF37',
              padding: '16px',
              color: '#D4AF37',
              background: '#000',
              fontSize: '10px',
              fontWeight: '900',
              letterSpacing: '0.18em',
              textTransform: 'uppercase'
            }
          }
        );

        resetForm();
        onSuccess();
      } else {
        toast.error(
          editingNotice
            ? `Failed to update ${mode === 'announcement' ? 'notice' : 'promotion'}`
            : `Failed to publish ${mode === 'announcement' ? 'notice' : 'promotion'}`,
          { id: loading }
        );
      }
    } catch (err) {
      toast.error('Server error', { id: loading });
    } finally {
      setIsDeploying(false);
    }
  };

  // Helper to render validation message
  const renderValidationMessage = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-2 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider"
        >
          <AlertCircle size={12} />
          <span>{errors[fieldName]}</span>
        </motion.div>
      );
    }
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName] && fieldName !== 'expiryDate') {
      return (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-wider"
        >
          <CheckCircle size={12} />
          <span>VALID</span>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* PAGE HEADER */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.30)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_28%)] pointer-events-none" />

        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.35em] mb-3 ${
                mode === 'announcement' ? 'text-blue-400' : 'text-[#D4AF37]'
              }`}
            >
              {pageMeta.badge}
            </p>

            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-white">
              {pageMeta.title}
            </h2>

            <p className="text-sm text-gray-400 mt-3 max-w-2xl">
              {pageMeta.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
                showPreview
                  ? mode === 'announcement'
                    ? 'border-blue-500/25 bg-blue-500/10 text-blue-400'
                    : 'border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'border-white/10 bg-white/[0.03] text-gray-400 hover:text-white'
              }`}
            >
              <Eye size={14} />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-xs font-semibold text-green-400">
              <ShieldCheck size={14} />
              Registry Online
            </div>
          </div>
        </div>
      </motion.div>

      {/* MAIN GRID */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 xl:grid-cols-[1.12fr_0.88fr] gap-8"
      >
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* COMMAND PANEL */}
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] backdrop-blur-2xl p-6 lg:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_34%)] pointer-events-none" />
            <motion.div
              animate={{ x: ['-100%', '120%'] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 h-[1px] w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-70"
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_0_24px_rgba(212,175,55,0.24)] ${
                      mode === 'announcement'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                        : 'bg-[#D4AF37] text-black'
                    }`}
                  >
                    {mode === 'announcement' ? (
                      <Sparkles size={20} />
                    ) : (
                      <Megaphone size={20} />
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                        mode === 'announcement' ? 'text-blue-400' : 'text-[#D4AF37]'
                      }`}
                    >
                      {pageMeta.panelBadge}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-white">
                      {pageMeta.formTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-xl">
                      {pageMeta.formDesc}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-semibold">
                    Secure Encryption
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-green-400 font-semibold mt-1">
                    Active
                  </p>
                </div>
              </div>

              {/* IMAGE */}
              <div className="rounded-[24px] border border-white/10 bg-black/25 p-5 mb-6">
                <div className="mb-4">
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                      mode === 'announcement' ? 'text-blue-400' : 'text-[#D4AF37]'
                    }`}
                  >
                    {pageMeta.imageTitle}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {pageMeta.imageDesc}
                  </p>
                </div>

                <ImageUpload
                  initialImage={imageUrl}
                  onUploadSuccess={(url) => setImageUrl(url)}
                  label={mode === 'announcement' ? 'Upload notice image' : 'Upload campaign image'}
                />
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* TITLE FIELD */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold block">
                    {pageMeta.titleLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder={pageMeta.titlePlaceholder}
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-2xl border px-5 py-4 text-sm font-medium text-white outline-none transition-all placeholder:text-gray-600 bg-black/25 ${
                      touched.title && errors.title
                        ? 'border-red-500 focus:border-red-500'
                        : touched.title && !errors.title && formData.title
                        ? 'border-green-500/50 focus:border-[#D4AF37]'
                        : 'border-white/10 focus:border-[#D4AF37]'
                    }`}
                  />
                  <AnimatePresence mode="wait">
                    {renderValidationMessage('title')}
                  </AnimatePresence>
                </div>

                {/* MESSAGE FIELD */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold block">
                    {pageMeta.messageLabel} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder={pageMeta.messagePlaceholder}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-2xl border px-5 py-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 h-36 resize-none bg-black/25 ${
                      touched.message && errors.message
                        ? 'border-red-500 focus:border-red-500'
                        : touched.message && !errors.message && formData.message
                        ? 'border-green-500/50 focus:border-[#D4AF37]'
                        : 'border-white/10 focus:border-[#D4AF37]'
                    }`}
                  />
                  <AnimatePresence mode="wait">
                    {renderValidationMessage('message')}
                  </AnimatePresence>
                </div>

                {/* DATE FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* START DATE */}
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar size={15} className="text-[#D4AF37]" />
                      <label className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold">
                        START DATE <span className="text-red-500">*</span>
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="date"
                        name="startDate"
                        min={today}
                        value={formData.startDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`premium-date-input w-full bg-transparent text-sm font-medium text-white outline-none pr-10 ${
                          touched.startDate && errors.startDate ? 'text-red-400' : ''
                        }`}
                      />
                      <Calendar
                        size={15}
                        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      {touched.startDate && errors.startDate && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="mt-2 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider"
                        >
                          <AlertCircle size={10} />
                          <span>{errors.startDate}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* EXPIRY DATE */}
                  <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock size={15} className="text-[#D4AF37]" />
                      <label className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-semibold">
                        EXPIRY DATE <span className="text-red-500">*</span>
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="date"
                        name="expiryDate"
                        min={formData.startDate || today}
                        value={formData.expiryDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`premium-date-input w-full bg-transparent text-sm font-medium text-white outline-none pr-10 ${
                          touched.expiryDate && errors.expiryDate ? 'text-red-400' : ''
                        }`}
                      />
                      <Clock
                        size={15}
                        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#D4AF37]"
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      {touched.expiryDate && errors.expiryDate && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="mt-2 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider"
                        >
                          <AlertCircle size={10} />
                          <span>{errors.expiryDate}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* URGENT BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, urgent: !formData.urgent })
                  }
                  className={`w-full rounded-2xl border px-5 py-4 text-sm font-semibold transition-all flex items-center justify-center gap-3 ${
                    formData.urgent
                      ? 'border-red-500/30 bg-red-500/12 text-red-400'
                      : 'border-white/10 bg-white/[0.03] text-gray-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle
                    size={16}
                    className={formData.urgent ? 'animate-pulse' : ''}
                  />
                  {formData.urgent ? pageMeta.priorityOn : pageMeta.priorityOff}
                </button>

                {/* NOTE */}
                <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.04] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#D4AF37] font-semibold mb-2">
                    {pageMeta.noteTitle}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {pageMeta.noteText}
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {editingNotice && (
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        onCancelEdit();
                      }}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={isDeploying}
                    className={`rounded-2xl py-4 text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-xl ${
                      editingNotice ? 'sm:col-span-1' : 'sm:col-span-2'
                    } ${
                      isDeploying
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-[#D4AF37] text-black hover:bg-white'
                    }`}
                  >
                    {isDeploying ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {pageMeta.loadingText}
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        {pageMeta.primaryButton}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - PREVIEW */}
        <div className="space-y-5">
          <AnimatePresence mode="wait">
            {showPreview && (
              <motion.div
                key="preview-card"
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.985 }}
                transition={{ duration: 0.35 }}
                className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.25)]"
              >
                <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between gap-4">
                  <div>
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                        mode === 'announcement' ? 'text-blue-400' : 'text-[#D4AF37]'
                      }`}
                    >
                      {pageMeta.previewTitle}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {pageMeta.previewSubtitle}
                    </p>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                      isUpcoming
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : mode === 'announcement'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                    }`}
                  >
                    {isUpcoming ? 'Upcoming' : 'Active'}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] min-h-[460px]">
                  <div className="p-6 sm:p-7 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className={`text-[11px] uppercase tracking-[0.18em] font-semibold ${
                          formData.urgent
                            ? 'text-red-400'
                            : mode === 'announcement'
                            ? 'text-blue-400'
                            : 'text-[#D4AF37]'
                        }`}
                      >
                        {formData.urgent
                          ? mode === 'announcement'
                            ? 'High Priority Broadcast'
                            : 'High Priority Promotion'
                          : isUpcoming
                          ? 'Upcoming Campaign'
                          : mode === 'announcement'
                          ? 'Internal Notice'
                          : 'Live Campaign'}
                      </span>

                      {formData.urgent && (
                        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-semibold uppercase tracking-[0.1em]">
                          Urgent
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                      {formData.title ||
                        (mode === 'announcement'
                          ? 'Notice Title Preview'
                          : 'Promotion Title Preview')}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} />
                        <span>
                          Start:{' '}
                          {formData.startDate
                            ? new Date(formData.startDate).toLocaleDateString()
                            : '—'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={13} />
                        <span>
                          End:{' '}
                          {formData.expiryDate
                            ? new Date(formData.expiryDate).toLocaleDateString()
                            : '—'}
                        </span>
                      </div>
                    </div>

                    <p className="mt-5 text-sm text-gray-300 leading-relaxed border-l-2 border-white/10 pl-4">
                      {formData.message ||
                        (mode === 'announcement'
                          ? 'Your internal staff notice will appear here once entered.'
                          : 'Your customer-facing campaign message will appear here once entered.')}
                    </p>

                    <div className="mt-7">
                      <button
                        type="button"
                        disabled
                        className={`px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 ${
                          isUpcoming
                            ? 'bg-white/[0.04] border border-white/8 text-gray-500'
                            : mode === 'announcement'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                            : 'bg-[#D4AF37] text-black'
                        }`}
                      >
                        {isUpcoming
                          ? 'Coming Soon'
                          : mode === 'announcement'
                          ? 'Broadcast Active'
                          : 'Secure Offer'}
                        {!isUpcoming && <ChevronRight size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="relative border-t lg:border-t-0 lg:border-l border-white/8 min-h-[260px]">
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_36%)]" />

                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl p-4">
                            <p
                              className={`text-[11px] uppercase tracking-[0.16em] font-semibold mb-2 ${
                                mode === 'announcement' ? 'text-blue-400' : 'text-[#D4AF37]'
                              }`}
                            >
                              Preview Image
                            </p>
                            <p className="text-sm text-white font-medium line-clamp-2">
                              {formData.title ||
                                (mode === 'announcement'
                                  ? 'Notice Title Preview'
                                  : 'Promotion Title Preview')}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="text-center px-6">
                          <div className="w-14 h-14 mx-auto rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-[#D4AF37] mb-4">
                            <ImageIcon size={24} />
                          </div>
                          <p className="text-sm text-gray-400 font-medium">
                            No image uploaded yet
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!canPreview && !showPreview && (
            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6 text-sm text-gray-500">
              Start entering details to generate a preview.
            </div>
          )}

          {/* SUMMARY CARD */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">
            <p
              className={`text-xs uppercase tracking-[0.3em] mb-3 ${
                mode === 'announcement' ? 'text-blue-400' : 'text-[#D4AF37]'
              }`}
            >
              ACTIVE PROTOCOLS
            </p>
            <h3 className="text-xl font-bold text-white">
              {mode === 'announcement' ? 'Broadcast Summary' : 'Campaign Summary'}
            </h3>

            <div className="mt-5 space-y-4">
              <SummaryCard
                label="Title Status"
                value={formData.title.trim() ? 'Configured' : 'Pending'}
                accent={formData.title.trim() ? 'success' : 'muted'}
              />
              <SummaryCard
                label="Image Status"
                value={imageUrl ? 'Attached' : 'Not Added'}
                accent={imageUrl ? 'success' : 'muted'}
              />
              <SummaryCard
                label="Priority Level"
                value={formData.urgent ? 'High Priority' : 'Standard'}
                accent={formData.urgent ? 'danger' : 'gold'}
              />
              <SummaryCard
                label="Schedule"
                value={
                  formData.expiryDate
                    ? `${formData.startDate || today} → ${formData.expiryDate}`
                    : 'Incomplete'
                }
                accent={formData.expiryDate ? 'gold' : 'muted'}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .premium-date-input::-webkit-calendar-picker-indicator {
          opacity: 0;
          cursor: pointer;
          width: 100%;
          position: absolute;
          right: 0;
        }
      `}</style>
    </motion.div>
  );
};

const SummaryCard = ({ label, value, accent = 'muted' }) => {
  const styles = {
    success: 'border-green-500/20 bg-green-500/8 text-green-400',
    danger: 'border-red-500/20 bg-red-500/8 text-red-400',
    gold: 'border-[#D4AF37]/20 bg-[#D4AF37]/8 text-[#D4AF37]',
    muted: 'border-white/10 bg-black/20 text-gray-400'
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 font-semibold">
        {label}
      </p>
      <div className={`inline-flex mt-3 rounded-full border px-3 py-1.5 text-xs font-semibold ${styles[accent]}`}>
        {value}
      </div>
    </div>
  );
};

export default PromotionNoticeManager;