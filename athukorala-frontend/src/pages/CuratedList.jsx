import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Trash2,
  ShoppingCart,
  Activity,
  LayoutGrid,
  Package,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  BadgeCheck,
  Search,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  SlidersHorizontal,
  Star,
  Gem
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CuratedList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('LATEST');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Authorized Guest"}');

  const fetchCurated = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/curated/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } else {
        toast.error('Failed to retrieve curated list');
      }
    } catch (err) {
      toast.error('Curated registry offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchCurated();
    } else {
      setLoading(false);
    }
  }, [user.id]);

  const handleAddToCartFromCurated = async (product) => {
    if (!user.id) {
      toast.error('Authentication required');
      return;
    }

    const loadingToast = toast.loading('Syncing with cart registry...');
    try {
      const res = await fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          quantity: 1
        })
      });

      if (res.ok) {
        toast.success(`${product.name} added to cart`, { id: loadingToast });
      } else {
        toast.error('Failed to add item to cart', { id: loadingToast });
      }
    } catch (err) {
      toast.error('Cart connection failed', { id: loadingToast });
    }
  };

  const handleRemove = async (id) => {
    const loadingToast = toast.loading('Removing from curated list...');
    try {
      const res = await fetch(`http://localhost:8080/api/curated/remove/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Item removed successfully', { id: loadingToast });
        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error('Failed to remove item', { id: loadingToast });
      }
    } catch (err) {
      toast.error('System error during removal', { id: loadingToast });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const getEffectivePrice = (product) => {
    if (
      product?.discountedPrice !== undefined &&
      product?.discountedPrice !== null &&
      Number(product.discountedPrice) < Number(product.price)
    ) {
      return Number(product.discountedPrice);
    }
    return Number(product?.price || 0);
  };

  const filteredItems = useMemo(() => {
    let result = Array.isArray(items) ? [...items] : [];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) => {
        const name = item?.product?.name?.toLowerCase() || '';
        const category = item?.product?.category?.toLowerCase() || '';
        const price = String(item?.product?.price || '').toLowerCase();
        return name.includes(term) || category.includes(term) || price.includes(term);
      });
    }

    if (sortType === 'PRICE_LOW_HIGH') {
      result.sort((a, b) => getEffectivePrice(a.product) - getEffectivePrice(b.product));
    } else if (sortType === 'PRICE_HIGH_LOW') {
      result.sort((a, b) => getEffectivePrice(b.product) - getEffectivePrice(a.product));
    } else if (sortType === 'NAME_A_Z') {
      result.sort((a, b) =>
        (a?.product?.name || '').localeCompare(b?.product?.name || '')
      );
    } else {
      result.sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0));
    }

    return result;
  }, [items, searchTerm, sortType]);

  const totalItems = items.length;
  const promotedItems = items.filter(
    (item) =>
      item?.product?.discountedPrice !== undefined &&
      item?.product?.discountedPrice !== null &&
      Number(item.product.discountedPrice) < Number(item.product.price)
  ).length;
  const totalValue = items.reduce((sum, item) => sum + getEffectivePrice(item.product), 0);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 96 : 300 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="hidden xl:flex h-screen sticky top-0 border-r border-white/10 bg-black/60 backdrop-blur-2xl flex-col z-40"
      >
        <div className="px-5 py-5 border-b border-white/8">
          <div className={`flex items-center justify-between gap-3 ${sidebarCollapsed ? 'flex-col' : ''}`}>
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] flex items-center justify-center shadow-[0_0_28px_rgba(212,175,55,0.22)]">
                <Activity className="text-black" size={22} />
              </div>

              {!sidebarCollapsed && (
                <div>
                  <p className="text-[18px] font-semibold tracking-tight text-white">
                    Athukorala
                  </p>
                  <p className="text-sm text-[#D4AF37] mt-0.5">
                    Client Registry
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition-all"
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>
        </div>

        <nav className="px-4 py-5 space-y-3 flex-1 overflow-y-auto">
          <SideNavItem
            icon={<LayoutGrid size={18} />}
            label="Market Registry"
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/customer-dashboard')}
          />
          <SideNavItem
            icon={<Package size={18} />}
            label="Order History"
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/order-history')}
          />
          <SideNavItem
            icon={<Heart size={18} />}
            label="Curated List"
            active
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/curated-list')}
          />
          <SideNavItem
            icon={<User size={18} />}
            label="Account Config"
            collapsed={sidebarCollapsed}
            onClick={() => navigate('/profile')}
          />
        </nav>

        <div className="px-4 pb-4 space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/30 bg-black flex items-center justify-center shrink-0">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user?.name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-[#D4AF37]">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-[0.14em]">
                    Authenticated Identity
                  </p>
                  <p className="text-lg font-medium text-[#D4AF37] mt-1 truncate">
                    {user?.name || 'Authorized Guest'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <BadgeCheck className="text-[#D4AF37]" size={18} />
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <div className="rounded-[28px] border border-[#D4AF37]/12 bg-[#D4AF37]/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#D4AF37] mb-3">
                Curated Intelligence
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Manage your favorite products, compare prices, and move premium picks into your cart in one place.
              </p>
            </div>
          )}

          <motion.button
            whileHover={{ x: sidebarCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full rounded-2xl px-4 py-3.5 border border-red-500/20 bg-red-500/8 text-red-300 hover:bg-red-500/12 flex items-center gap-3 transition-all ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span className="text-sm font-medium">Terminate Session</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[760px] h-[760px] bg-[#D4AF37]/5 blur-[180px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-white/[0.02] blur-[150px] rounded-full -z-10 pointer-events-none" />

        <div className="px-5 sm:px-8 lg:px-10 2xl:px-14 py-8 lg:py-10">
          {/* TOP BAR */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8"
          >
            <div>
              <p className="text-sm text-gray-400">Customer Portal</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Curated List
              </h2>
            </div>

            <TopUserChip user={user} />
          </motion.div>

          {/* MOBILE TOP BAR */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:hidden mb-6 rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#D4AF37] flex items-center justify-center shadow-[0_0_22px_rgba(212,175,55,0.22)]">
                <Heart className="text-black" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Customer Portal</p>
                <h2 className="text-lg font-semibold">Curated List</h2>
              </div>
            </div>

            <button
              onClick={() => navigate('/customer-dashboard')}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition-all"
            >
              Dashboard
            </button>
          </motion.div>

          {/* HERO */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8"
          >
            <div className="rounded-[34px] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent backdrop-blur-2xl p-6 sm:p-8 lg:p-10 overflow-hidden relative">
              <div className="absolute -top-16 -right-10 w-56 h-56 bg-[#D4AF37]/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/[0.03] blur-3xl rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[#D4AF37] mb-5">
                    <ShieldCheck size={14} />
                    Personal Favorites Vault
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-tight leading-tight">
                    Save your
                    <span className="block text-[#D4AF37]">best product picks</span>
                  </h1>

                  <p className="text-sm sm:text-base text-gray-400 max-w-2xl mt-5 leading-relaxed">
                    Your curated list keeps premium items, promotions, and future purchases organized in one clean interface.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full xl:w-auto xl:min-w-[520px]">
                  <MetricCard
                    icon={<Heart size={18} />}
                    label="Saved Items"
                    value={totalItems}
                  />
                  <MetricCard
                    icon={<Sparkles size={18} />}
                    label="Promotions"
                    value={promotedItems}
                  />
                  <MetricCard
                    icon={<ArrowUpRight size={18} />}
                    label="Estimated Value"
                    value={`LKR ${totalValue.toLocaleString()}`}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* SEARCH + SORT */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Search by product name, category, or price..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-12 rounded-2xl border border-white/10 bg-[#050505]/70 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#D4AF37]/40 transition-all"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-[#D4AF37]">
                    <SlidersHorizontal size={18} />
                  </div>

                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="h-12 rounded-2xl border border-white/10 bg-[#050505] px-4 text-sm text-white outline-none focus:border-[#D4AF37]/40 transition-all"
                  >
                    <option value="LATEST">Latest Added</option>
                    <option value="PRICE_LOW_HIGH">Price: Low to High</option>
                    <option value="PRICE_HIGH_LOW">Price: High to Low</option>
                    <option value="NAME_A_Z">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.section>

          {/* CONTENT */}
          {loading ? (
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] min-h-[320px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-[#D4AF37]">
                <Activity className="animate-spin" size={34} />
                <p className="text-sm text-gray-400">Loading curated assets...</p>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] py-20 px-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <Heart className="text-[#D4AF37]" size={28} />
              </div>
              <h3 className="text-2xl font-semibold mb-3">No curated items found</h3>
              <p className="text-gray-400 max-w-xl mx-auto">
                Your curated list is empty or no products match your current search.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <CuratedCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCartFromCurated}
                    onRemove={handleRemove}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

const getInitials = (name) => {
  const parts = (name || 'User').trim().split(' ');
  const first = parts[0]?.charAt(0) || '';
  const second = parts[1]?.charAt(0) || '';
  return `${first}${second}`.toUpperCase() || 'U';
};

const TopUserChip = ({ user }) => {
  return (
    <div className="flex items-center gap-4 self-start lg:self-auto rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/30 bg-black flex items-center justify-center shrink-0">
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user?.name || 'Profile'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-[#D4AF37]">
            {getInitials(user?.name)}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
          Logged in as
        </p>
        <p className="text-sm font-medium text-white">
          {user?.name || 'Authorized Guest'}
        </p>
      </div>
    </div>
  );
};

const SideNavItem = ({ icon, label, active = false, collapsed = false, onClick }) => {
  return (
    <motion.button
      whileHover={{ x: collapsed ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all border ${
        active
          ? 'border-[#D4AF37]/25 bg-[#D4AF37] text-black shadow-[0_12px_35px_rgba(212,175,55,0.18)]'
          : 'border-transparent bg-transparent text-gray-300 hover:bg-white/[0.05] hover:border-white/8'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <span className={active ? 'text-black' : 'text-[#D4AF37]'}>{icon}</span>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </motion.button>
  );
};

const MetricCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/30 backdrop-blur-xl p-4">
      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] mb-3">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.14em] text-gray-500">{label}</p>
      <p className="text-lg sm:text-xl font-semibold mt-2 break-words">{value}</p>
    </div>
  );
};

const CuratedCard = ({ item, onAddToCart, onRemove }) => {
  const product = item?.product || {};
  const hasPromotion =
    product?.discountedPrice !== undefined &&
    product?.discountedPrice !== null &&
    Number(product.discountedPrice) < Number(product.price);

  const effectivePrice = hasPromotion
    ? Number(product.discountedPrice)
    : Number(product.price || 0);

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0 }
      }}
      exit={{ opacity: 0, y: 12, scale: 0.96 }}
      whileHover={{ y: -5 }}
      className="group rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.03] to-transparent backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all overflow-hidden"
    >
      <div className="relative rounded-[24px] border border-white/10 bg-black/30 min-h-[220px] flex items-center justify-center mb-5 overflow-hidden">
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-gray-300">
            <Gem size={12} />
            Curated
          </span>

          {hasPromotion && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300">
              <Sparkles size={12} />
              Promotion
            </span>
          )}
        </div>

        <img
          src={product?.imageUrl}
          alt={product?.name || 'Product image'}
          className="w-full h-[220px] object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mb-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-xl font-semibold tracking-tight text-white leading-snug">
            {product?.name || 'Unnamed Product'}
          </h3>

          <div className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Star size={16} />
          </div>
        </div>

        <p className="text-sm text-gray-400 capitalize mb-4">
          {product?.category || 'General category'}
        </p>

        <div className="rounded-[22px] border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-gray-500 mb-3">
            Current Price
          </p>

          {hasPromotion ? (
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-2xl font-semibold text-[#D4AF37]">
                LKR {effectivePrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 line-through">
                LKR {Number(product.price || 0).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-300">
                <CheckCircle2 size={12} />
                Discount Active
              </span>
            </div>
          ) : (
            <span className="text-2xl font-semibold text-white">
              LKR {effectivePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddToCart(product)}
          className="rounded-2xl bg-[#D4AF37] text-black py-3.5 px-4 text-sm font-semibold hover:brightness-105 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onRemove(item.id)}
          className="rounded-2xl border border-red-500/20 bg-red-500/8 text-red-300 py-3.5 px-4 text-sm font-semibold hover:bg-red-500/12 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Remove
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CuratedList;