import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast'; // IMPORTED TOAST FOR FEEDBACK

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0); // STATE FOR DYNAMIC CART COUNT
  const [isError, setIsError] = useState(false); // NEW: Protocol error state
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/products/all")
      .then(res => {
        if (!res.ok) throw new Error("Registry Sync Failure");
        return res.json();
      })
      .then(data => {
        // Ensure data is an array before setting state to prevent .map() crashes
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);
        setFilteredProducts(productList);
        setIsError(false);
      })
      .catch(err => {
        console.error("Catalog Offline:", err);
        setIsError(true);
        setProducts([]);
        setFilteredProducts([]);
      });
    
    // FETCH INITIAL CART COUNT ON LOAD
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
       // fetch(`http://localhost:8080/api/cart/count/${user.id}`)...
    }
  }, []);

  useEffect(() => {
    // Safety check: only filter if products is a valid array
    let result = Array.isArray(products) ? products : [];
    
    if (category !== "ALL") {
      result = result.filter(p => p.category?.toUpperCase() === category);
    }
    if (searchTerm) {
      result = result.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [category, searchTerm, products]);

  // LOGIC TO ADD ASSET TO THE SHOPPING CART REGISTRY
  const handleAddToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
      toast.error("AUTHENTICATION REQUIRED FOR PURCHASE PROTOCOL");
      return;
    }

    if (product.stockQuantity <= 0) {
      toast.error("ASSET DEPLETED: CANNOT INITIALIZE PURCHASE");
      return;
    }

    const loadingToast = toast.loading("Syncing with Cart Registry...");

    try {
      const response = await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          productId: product.id, 
          quantity: 1 
        }),
      });

      if (response.ok) {
        toast.success("Asset added to shopping cart", { id: loadingToast });
        setCartCount(prev => prev + 1);
      } else {
        toast.error("System Error: Cart update failed", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Connection Failed: Ensure Backend is online", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-16 font-sans">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-4">Athukorala Traders</p>
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">
            Premium <br /> <span className="text-transparent stroke-text">Hardware</span>
          </h1>
        </motion.div>

        <div className="flex flex-col gap-6 w-full md:w-auto">
          {/* CART INDICATOR - CONNECTED TO CART NAVIGATION */}
          <div className="flex justify-end mb-2">
              <button 
                onClick={() => navigate('/shopping-cart')}
                className="flex items-center gap-3 group text-gray-500 hover:text-[#D4AF37] transition-colors"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Active Cart</span>
                <div className="relative p-2 border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors">
                    <ShoppingCart size={18} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D4AF37] text-black text-[8px] font-bold flex items-center justify-center">
                      {cartCount}
                    </div>
                </div>
              </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH ASSETS..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 py-4 pl-12 pr-8 text-[10px] tracking-widest outline-none focus:border-[#D4AF37]/50 w-full md:w-80 uppercase font-bold transition-all"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["ALL", "ELECTRICAL", "PLUMBING", "TOOLS", "PAINTS"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 text-[9px] font-black tracking-widest uppercase border transition-all ${category === cat ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-white/10 text-gray-500 hover:border-white/30'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ERROR MESSAGE IF BACKEND IS DOWN */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-red-500/20 bg-red-500/5 mb-10">
          <AlertCircle className="text-red-500 mb-4" size={40} />
          <p className="text-[10px] font-black tracking-[0.4em] text-red-500 uppercase">Logistics Server Unreachable</p>
          <p className="text-[10px] text-gray-500 uppercase mt-2">Please verify backend status in IntelliJ</p>
        </div>
      )}

      {/* PRODUCT GRID - ADDED OPTIONAL CHAINING TO PREVENT CRASH */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <AnimatePresence>
          {filteredProducts?.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              navigate={navigate} 
              onAddToCart={() => handleAddToCart(product)} 
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(212, 175, 55, 0.5); color: transparent; } .no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

const ProductCard = ({ product, navigate, onAddToCart }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -10 }}
    className="group relative bg-white/[0.02] border border-white/5 p-6 transition-all hover:bg-white/[0.04] hover:border-[#D4AF37]/30"
  >
    {/* Product Image */}
    <div className="aspect-square bg-black border border-white/5 mb-6 overflow-hidden relative">
      <img 
        src={product?.imageUrl || "https://res.cloudinary.com/demo/image/upload/v1631530000/industrial-box.png"} 
        alt={product?.name} 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
      />
      {product?.stockQuantity <= 0 && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <span className="text-[10px] font-black tracking-[0.4em] text-red-500 border border-red-500/50 px-4 py-2 uppercase">Out of Stock</span>
        </div>
      )}
    </div>

    {/* Details */}
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <p className="text-[#D4AF37] text-[9px] font-black tracking-widest uppercase">{product?.category}</p>
        <p className="text-gray-500 font-mono text-[10px]">LKR {product?.price?.toLocaleString()}</p>
      </div>
      <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-[#D4AF37] transition-colors">{product?.name}</h3>
    </div>

    {/* Hover Actions */}
    <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
      <button 
        onClick={onAddToCart}
        disabled={product?.stockQuantity <= 0}
        className={`flex-1 ${product?.stockQuantity <= 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'} py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all`}
      >
        <ShoppingCart size={14} /> Add to Cart
      </button>
      
      <button 
        onClick={() => navigate(`/product/${product?.id}`)}
        className="p-3 border border-white/10 hover:border-[#D4AF37] transition-colors"
      >
        <Eye size={16} />
      </button>
    </div>
  </motion.div>
);

export default CustomerDashboard;