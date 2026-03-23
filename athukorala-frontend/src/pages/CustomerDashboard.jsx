import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Eye, AlertCircle, 
  Home, Package, Heart, History, LogOut, User, Activity 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0); 
  const [isError, setIsError] = useState(false); 
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Guest"}');

  useEffect(() => {
    fetch("http://localhost:8080/api/products/all")
      .then(res => {
        if (!res.ok) throw new Error("Registry Sync Failure");
        return res.json();
      })
      .then(data => {
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);
        setFilteredProducts(productList);
        setIsError(false);
      })
      .catch(err => {
        console.error("Catalog Offline:", err);
        setIsError(true);
      });
    
    // Initial Cart Count Logic could go here
  }, []);

  useEffect(() => {
    let result = Array.isArray(products) ? products : [];
    if (category !== "ALL") {
      result = result.filter(p => p.category?.toUpperCase() === category);
    }
    if (searchTerm) {
      result = result.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [category, searchTerm, products]);

  const handleAddToCart = async (product) => {
    if (user.name === "Guest") {
      toast.error("AUTHENTICATION REQUIRED FOR PURCHASE PROTOCOL");
      return;
    }
    if (product.stockQuantity <= 0) {
      toast.error("ASSET DEPLETED");
      return;
    }

    const loadingToast = toast.loading("Syncing with Cart Registry...");
    try {
      const response = await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1 }),
      });

      if (response.ok) {
        toast.success("Asset added to cart", { id: loadingToast });
        setCartCount(prev => prev + 1);
      } else {
        toast.error("System Error", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Backend Offline", { id: loadingToast });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Animation Variants
  const containerVars = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden">
      
      {/* SIDEBAR - Added for consistency and navigation */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-10 relative z-50 hidden md:flex"
      >
        <div className="flex items-center gap-4 px-2">
          <div className="p-2 bg-[#D4AF37] rounded-sm">
            <Activity className="text-black" size={24} />
          </div>
          <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={<Home size={18}/>} label="Home Catalog" active={true} />
          <NavItem icon={<Package size={18}/>} label="My Orders" onClick={() => navigate('/orders')} />
          <NavItem icon={<Heart size={18}/>} label="Wishlist" />
          <NavItem icon={<User size={18}/>} label="Profile Settings" />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-gray-500 hover:text-red-500 transition-all text-[10px] font-bold uppercase tracking-widest group">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Terminate Session
          </button>
        </div>
      </motion.aside>

      {/* MAIN INTERFACE */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full -z-10" />

        <header className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase">Identity Verified: {user.name}</p>
            </div>
            <h1 className="text-7xl font-black uppercase tracking-tighter leading-[0.85]">
              Premium <br /> <span className="text-transparent stroke-text">Hardware</span>
            </h1>
          </motion.div>

          <div className="flex flex-col gap-6 w-full md:w-auto items-end">
            <div className="flex items-center gap-6">
               <button 
                  onClick={() => navigate('/shopping-cart')}
                  className="flex items-center gap-3 group text-gray-500 hover:text-[#D4AF37] transition-all"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Cart</span>
                  <div className="relative p-3 border border-white/10 group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/5 transition-all">
                      <ShoppingCart size={20} />
                      <AnimatePresence>
                        {cartCount > 0 && (
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-black flex items-center justify-center shadow-lg"
                          >
                            {cartCount}
                          </motion.div>
                        )}
                      </AnimatePresence>
                  </div>
                </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="SEARCH ASSETS..." 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border border-white/10 py-4 pl-12 pr-8 text-[10px] tracking-widest outline-none focus:border-[#D4AF37] w-full md:w-96 uppercase font-bold transition-all placeholder:text-gray-700"
                />
              </div>
              
              <div className="flex gap-2">
                {["ALL", "ELECTRICAL", "PLUMBING", "TOOLS", "PAINTS"].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-5 py-2 text-[9px] font-black tracking-widest uppercase border transition-all ${category === cat ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {isError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 border border-dashed border-red-500/20 bg-red-500/5 mb-10">
            <AlertCircle className="text-red-500 mb-4" size={40} />
            <p className="text-[10px] font-black tracking-[0.4em] text-red-500 uppercase">Logistics Server Unreachable</p>
          </motion.div>
        )}

        <motion.div 
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
        >
          <AnimatePresence>
            {filteredProducts?.map((product, idx) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                navigate={navigate} 
                onAddToCart={() => handleAddToCart(product)} 
                delay={idx * 0.05}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-4 transition-all text-[11px] font-bold tracking-[0.2em] uppercase ${active ? 'bg-[#D4AF37] text-black shadow-[0_10px_30px_rgba(212,175,55,0.15)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

const ProductCard = ({ product, navigate, onAddToCart, delay }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0, transition: { delay } }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -10 }}
    className="group relative bg-white/[0.02] border border-white/5 p-6 transition-all hover:bg-white/[0.04] hover:border-[#D4AF37]/30 shadow-xl"
  >
    <div className="aspect-square bg-[#0a0a0a] border border-white/5 mb-6 overflow-hidden relative">
      <img 
        src={product?.imageUrl || "https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png"} 
        alt={product?.name} 
        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
      />
      {product?.stockQuantity <= 0 && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <span className="text-[10px] font-black tracking-[0.4em] text-red-500 border border-red-500/50 px-4 py-2 uppercase">Out of Stock</span>
        </div>
      )}
    </div>

    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <p className="text-[#D4AF37] text-[9px] font-black tracking-widest uppercase">{product?.category}</p>
        <p className="text-gray-500 font-mono text-[10px]">LKR {product?.price?.toLocaleString()}</p>
      </div>
      <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-[#D4AF37] transition-colors leading-tight min-h-[3rem]">{product?.name}</h3>
    </div>

    <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
      <button 
        onClick={onAddToCart}
        disabled={product?.stockQuantity <= 0}
        className={`flex-1 ${product?.stockQuantity <= 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'} py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg`}
      >
        <ShoppingCart size={14} /> Buy
      </button>
      
      <button 
        onClick={() => navigate(`/product/${product?.id}`)}
        className="p-4 border border-white/10 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors"
      >
        <Eye size={16} />
      </button>
    </div>
  </motion.div>
);

export default CustomerDashboard;