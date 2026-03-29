import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Box, DollarSign, ListTree, Truck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';

const AddProductModal = ({ isOpen, onClose }) => {
  // Added formState to detect validation errors
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  // --- HARDWARE CATEGORIES FOR CONSISTENCY ---
  const HARDWARE_CATEGORIES = [
    "Electrical",
    "Plumbing",
    "Painting & Adhesives",
    "Power Tools",
    "Hand Tools",
    "Building Materials",
    "Fasteners & Screws",
    "Safety Gear"
  ];

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8080/api/suppliers/all")
        .then((res) => res.json())
        .then((data) => setSuppliers(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Could not load suppliers", err));
    }
  }, [isOpen]);

  const getDefaultIcon = (category) => {
    if (!category) return "https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png";
    const cat = category.toLowerCase();
    if (cat.includes('paint')) return "https://res.cloudinary.com/demo/image/upload/v1631530000/paint-icon.png";
    if (cat.includes('tool')) return "https://res.cloudinary.com/demo/image/upload/v1631530000/hammer-icon.png";
    if (cat.includes('elect')) return "https://res.cloudinary.com/demo/image/upload/v1631530000/bolt-icon.png";
    return "https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png";
  };

  const onSubmit = async (data) => {
    // --- MANUAL VALIDATION OVERRIDE ---
    if (!data.name || !data.category || !data.supplierId || !data.price || !data.stockQuantity) {
      toast.error("PROTOCOL REJECTED: ALL FIELDS MANDATORY");
      return;
    }

    const finalData = {
      ...data,
      price: parseFloat(data.price),
      stockQuantity: parseInt(data.stockQuantity),
      reorderLevel: 5, 
      imageUrl: uploadedImageUrl || getDefaultIcon(data.category),
      supplier: data.supplierId ? { id: parseInt(data.supplierId) } : null
    };

    // Double check for logic errors
    if (finalData.price <= 0 || finalData.stockQuantity < 0) {
        toast.error("VALUATION ERROR: INVALID NUMERIC DATA");
        return;
    }

    const loadingToast = toast.loading("Recording Asset...");

    try {
      const response = await fetch("http://localhost:8080/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        toast.success("Product Inventory Updated!", { id: loadingToast });
        reset();
        setUploadedImageUrl("");
        onClose();
        window.location.reload(); 
      } else {
        toast.error("Server rejected data format", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Database connection failed.", { id: loadingToast });
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-end bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }}
        className="w-full max-w-lg h-full bg-[#080808] border-l border-[#D4AF37]/20 p-12 relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <header className="mb-12">
          <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2">New Entry</p>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Inventory Item</h2>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="group">
             <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3">Product Visual</label>
             <ImageUpload onUploadSuccess={(url) => setUploadedImageUrl(url)} />
          </div>

          <InputGroup 
            label="Product Name" 
            icon={<Box size={16}/>} 
            register={register("name", { required: true })} 
            placeholder="e.g. Nippon Paint Gold" 
            error={errors.name}
          />
          
          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3 text-left">Primary Supplier</label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors">
                <Truck size={16} />
              </div>
              <select 
                {...register("supplierId", { required: true })}
                className={`w-full bg-transparent border-b pl-8 py-3 outline-none text-sm uppercase tracking-widest transition-all appearance-none text-white ${errors.supplierId ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'}`}
              >
                <option value="" className="bg-[#080808]">Select Supplier...</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#080808]">{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="group text-left">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3">Category</label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors">
                <ListTree size={16} />
              </div>
              <select 
                {...register("category", { required: true })}
                className={`w-full bg-transparent border-b pl-8 py-3 outline-none text-sm uppercase tracking-widest transition-all appearance-none text-white cursor-pointer ${errors.category ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'}`}
              >
                <option value="" className="bg-[#080808]">Select Category...</option>
                {HARDWARE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-[#080808]">{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <InputGroup 
                label="Unit Price" 
                icon={<DollarSign size={16}/>} 
                register={register("price", { required: true, min: 0.01 })} 
                placeholder="0.00" 
                type="number" 
                error={errors.price}
            />
            <InputGroup 
                label="Quantity" 
                icon={<Box size={16}/>} 
                register={register("stockQuantity", { required: true, min: 0 })} 
                placeholder="0" 
                type="number" 
                error={errors.stockQuantity}
            />
          </div>

          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3">Specifications</label>
            <textarea 
              {...register("description")}
              className="w-full bg-white/5 border border-white/10 p-4 focus:border-[#D4AF37] outline-none transition-all text-sm h-32"
            />
          </div>

          <button type="submit" className="w-full bg-[#D4AF37] text-black font-black py-5 tracking-[0.4em] uppercase flex items-center justify-center gap-3 hover:bg-[#E5C158] transition-all mt-10 shadow-[0_10px_40px_rgba(212,175,55,0.2)]">
            <Save size={20} /> Record Asset
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const InputGroup = ({ label, icon, register, placeholder, type = "text", error }) => (
  <div className="group">
    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-3 text-left">{label}</label>
    <div className="relative text-left">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors">{icon}</div>
      <input 
        {...register} type={type} placeholder={placeholder} step="any"
        className={`w-full bg-transparent border-b pl-8 py-3 outline-none transition-all text-sm uppercase tracking-widest placeholder:text-gray-800 ${error ? 'border-red-500' : 'border-white/10 focus:border-[#D4AF37]'}`}
      />
    </div>
  </div>
);

export default AddProductModal;