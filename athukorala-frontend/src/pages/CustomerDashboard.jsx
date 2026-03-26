import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Eye, AlertCircle, 
  Home, Package, Heart, User, Activity, LogOut, 
  X, Trash2, Plus, Minus, CreditCard, Tag, Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import CustomerAnnouncement from '../components/CustomerAnnouncement'; 

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isError, setIsError] = useState(false); 
  const navigate = useNavigate();
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Guest"}');

  useEffect(() => {
    fetchProducts();
    if (user.id) fetchCart();
  }, []);

  const fetchProducts = () => {
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
  };

  const fetchCart = async () => {
    if (!user.id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/cart/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Cart sync failure:", err);
    }
  };

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
        toast.success(`${product.name} Added to Cart`, { id: loadingToast });
        await fetchCart(); 
        setIsCartOpen(true); 
      } else {
        toast.error("System Error: Registry Refused Data", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Backend Connection Failure", { id: loadingToast });
    }
  };

  const updateCartQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(`http://localhost:8080/api/cart/update-quantity/${itemId}?quantity=${newQty}`, {
        method: "PATCH"
      });
      if (res.ok) fetchCart();
    } catch (err) { toast.error("Update Failed"); }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/cart/remove/${itemId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Removed from registry");
        fetchCart();
      }
    } catch (err) { toast.error("Removal Failed"); }
  };

  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((acc, item) => {
      const price = item?.product?.discountedPrice || item?.product?.price || 0;
      return acc + (price * (item?.quantity || 0));
    }, 0);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const containerVars = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl p-8 flex flex-col gap-10 relative z-50 hidden md:flex"
      >
        <div className="flex items-center gap-4 px-2">
          <Activity className="text-[#D4AF37]" size={24} />
          <span className="font-black tracking-[0.3em] uppercase text-sm">Athukorala</span>
        </div>
        <nav className="flex flex-col gap-2">
          <NavItem icon={<Home size={18}/>} label="Home Catalog" active={true} />
          <NavItem icon={<Package size={18}/>} label="My Orders" onClick={() => navigate('/order-history')} />
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
      <main className="flex-1 p-8 md:p-16 overflow-y-auto relative text-left">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[150px] rounded-full -z-10" />

        <CustomerAnnouncement />

        <header className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase">Identity Verified: {user?.name || "Guest"}</p>
            </div>
            <h1 className="text-7xl font-black uppercase tracking-tighter leading-[0.85]">
              Premium <br /> <span className="text-transparent stroke-text">Hardware</span>
            </h1>
          </motion.div>

          <div className="flex flex-col gap-6 w-full md:w-auto items-end">
            <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-3 group text-gray-500 hover:text-[#D4AF37] transition-all text-left">
                <span className="text-[10px] font-black uppercase tracking-widest">Cart Registry</span>
                <div className="relative p-3 border border-white/10 group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/5 transition-all">
                    <ShoppingCart size={20} />
                    <AnimatePresence>
                        {cartItems && cartItems.length > 0 && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-[8px] font-black flex items-center justify-center shadow-lg">
                            {cartItems.length}
                        </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </button>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                <input type="text" placeholder="SEARCH ASSETS..." onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 py-4 pl-12 pr-8 text-[10px] tracking-widest outline-none focus:border-[#D4AF37] w-full md:w-96 uppercase font-bold transition-all placeholder:text-gray-700" />
            </div>
            
            <div className="flex gap-2">
              {["ALL", "ELECTRICAL", "PLUMBING", "TOOLS", "PAINTS"].map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-2 text-[9px] font-black tracking-widest uppercase border transition-all ${category === cat ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        <motion.div variants={containerVars} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          <AnimatePresence>
            {filteredProducts?.map((product, idx) => (
              <ProductCard key={product?.id} product={product} navigate={navigate} onAddToCart={() => handleAddToCart(product)} delay={idx * 0.05} />
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* --- CART OVERLAY (UNCHANGED) --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[101] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-white/5 flex justify-between items-center text-left">
                <div className="flex items-center gap-3">
                    <ShoppingCart size={18} className="text-[#D4AF37]" />
                    <h2 className="text-xl font-black uppercase tracking-[0.2em]">Cart Registry</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 text-gray-500 transition-colors"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {(!cartItems || cartItems.length === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                    <ShoppingCart size={48} className="opacity-10" />
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase">No Assets Recorded</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div layout key={item?.id} className="flex gap-4 group border-b border-white/5 pb-6">
                      <div className="w-20 h-20 bg-black border border-white/5 p-2 shrink-0">
                         <img src={item?.product?.imageUrl || ""} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-start mb-1 text-left">
                            <h4 className="text-sm font-bold uppercase truncate pr-4">{item?.product?.name || "Loading..."}</h4>
                            <button onClick={() => removeFromCart(item?.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                        </div>
                        <p className="text-[9px] font-black uppercase text-[#D4AF37] mb-3">{item?.product?.category || "Hardware"}</p>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 bg-white/5 px-3 py-1 border border-white/10">
                              <Minus size={12} className="cursor-pointer hover:text-[#D4AF37]" onClick={() => updateCartQuantity(item?.id, item?.quantity - 1)} />
                              <span className="text-[10px] font-mono">{item?.quantity || 0}</span>
                              <Plus size={12} className="cursor-pointer hover:text-[#D4AF37]" onClick={() => updateCartQuantity(item?.id, item?.quantity + 1)} />
                            </div>
                            <p className="font-mono text-xs text-white">LKR {((item?.product?.discountedPrice || item?.product?.price || 0) * (item?.quantity || 0)).toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-8 bg-white/[0.02] border-t border-white/10 text-left">
                <div className="flex justify-between items-end mb-8">
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Grand Total</p>
                    <p className="text-3xl font-black text-[#D4AF37] tracking-tighter">LKR {calculateTotal().toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Secure Checkout</p>
                  </div>
                </div>
                <button onClick={() => { localStorage.setItem("lastCartTotal", calculateTotal()); setIsCartOpen(false); navigate('/checkout'); }} className="w-full bg-[#D4AF37] text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3">
                  <CreditCard size={16} /> Finalize Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; }`}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-5 px-6 py-4 transition-all text-[11px] font-bold tracking-[0.2em] uppercase ${active ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
      {icon} {label}
    </button>
);

/* --- UI/UX OPTIMIZED PREMIUM PRODUCT CARD --- */
const ProductCard = ({ product, navigate, onAddToCart, delay }) => {
  const hasDiscount = product?.discountedPrice && product.discountedPrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) 
    : 0;

  return (
    <motion.div 
      layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay, duration: 0.5 } }}
      whileHover={{ y: -12, borderColor: 'rgba(212, 175, 55, 0.4)' }}
      className="group relative bg-[#080808] border border-white/5 p-0 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-full overflow-hidden"
    >
      {/* 1. PREMIUM DISCOUNT BADGE */}
      {hasDiscount && (
        <div className="absolute top-0 left-0 z-20 bg-[#D4AF37] text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
          <Sparkles size={12} className="animate-pulse" /> -{discountPercent}% OFF
        </div>
      )}

      {/* 2. ASSET VISUALIZER */}
      <div className="relative aspect-[4/5] bg-black overflow-hidden border-b border-white/5">
        <img 
          src={product?.imageUrl} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
          alt={product?.name} 
        />
        
        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
           <button onClick={() => navigate(`/product/${product?.id}`)} className="p-4 bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-all rounded-full border border-white/10 hover:border-[#D4AF37]">
              <Eye size={20} />
           </button>
           <button onClick={onAddToCart} className="p-4 bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-all rounded-full border border-white/10 hover:border-[#D4AF37]">
              <ShoppingCart size={20} />
           </button>
        </div>
      </div>

      {/* 3. DATA ARCHITECTURE */}
      <div className="p-8 flex flex-col flex-1 text-left">
        <div className="mb-6">
          <p className="text-[#D4AF37] text-[9px] font-bold tracking-[0.4em] uppercase mb-2 opacity-60">
            {product?.category}
          </p>
          <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-[#D4AF37] transition-colors">
            {product?.name}
          </h3>
        </div>

        {/* 4. PRICE PROTOCOL (Premium UI) */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">
            {hasDiscount ? "Special Protocol Price" : "Standard Registry Value"}
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-mono font-black tracking-tighter">
              LKR {hasDiscount ? product.discountedPrice.toLocaleString() : product.price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-700 line-through font-mono">
                {product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* 5. INTERACTION LAYER */}
        <button 
          onClick={onAddToCart} 
          className="w-full mt-8 py-4 bg-white/5 border border-white/10 group-hover:bg-[#D4AF37] group-hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-sm hover:shadow-[#D4AF37]/20"
        >
          <Plus size={14} /> ADD TO CART
        </button>
      </div>
    </motion.div>
  );
};

export default CustomerDashboard;