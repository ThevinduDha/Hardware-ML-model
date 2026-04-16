import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Range, getTrackBackground } from "react-range";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [promotions, setPromotions] = useState([]);

  // 🔥 SLIDER STATE
  const [values, setValues] = useState([0, 100000]);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/products/all").then(res => res.json()),
      fetch("http://localhost:8080/api/promotions/all").then(res => res.json())
    ]).then(([productData, promoData]) => {
      const safeProducts = Array.isArray(productData) ? productData : [];
      setProducts(safeProducts);
      setFiltered(safeProducts);
      setPromotions(Array.isArray(promoData) ? promoData : []);
    });
  }, []);

  // 🔥 PRICE WITH PROMOTION
  const getEffectivePrice = (product) => {
    const now = new Date();

    const activePromo = promotions.find(p => 
      (p.targetId === product.id || p.targetCategory === product.category) &&
      p.active &&
      new Date(p.startDate) <= now &&
      new Date(p.endDate) >= now
    );

    if (!activePromo) return { price: product.price, isDiscounted: false };

    let discountedPrice = product.price;

    if (activePromo.type === 'PERCENTAGE') {
      discountedPrice = product.price * (1 - activePromo.value / 100);
    } else {
      discountedPrice = product.price - activePromo.value;
    }

    return { 
      price: Math.max(0, discountedPrice),
      isDiscounted: true,
      promoTitle: activePromo.title
    };
  };

  // 🔥 AUTO FILTER (NO BUTTON)
  useEffect(() => {
    const result = products.filter((p) => {
      const effective = getEffectivePrice(p);
      return (
        effective.price >= values[0] &&
        effective.price <= values[1]
      );
    });

    setFiltered(result);
  }, [values, products, promotions]);

  return (
    <div className="relative text-left">

      {/* 🔥 SLIDER FILTER */}
      <div className="mb-6 p-6 border border-white/10 rounded-xl bg-white/[0.02] max-w-md">
        <h3 className="text-[#D4AF37] font-bold mb-4">Filter by Price</h3>

        <div className="flex justify-between text-sm mb-4">
          <span>LKR {values[0]}</span>
          <span>LKR {values[1]}</span>
        </div>

        <Range
          values={values}
          step={100}
          min={0}
          max={100000}
          onChange={(vals) => setValues(vals)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 w-full rounded"
              style={{
                background: getTrackBackground({
                  values,
                  colors: ["#444", "#D4AF37", "#444"],
                  min: 0,
                  max: 100000
                })
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-5 w-5 bg-[#D4AF37] rounded-full shadow-lg"
            />
          )}
        />
      </div>

      {/* 🔥 PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filtered.map(product => {
          const effective = getEffectivePrice(product);

          return (
            <div key={product.id} className="p-6 border border-white/10 bg-white/[0.02] group hover:border-[#D4AF37]/50 transition-all relative">

              {effective.isDiscounted && (
                <div className="absolute top-4 right-4 bg-[#D4AF37] text-black text-[8px] font-black px-2 py-1 uppercase tracking-widest flex items-center gap-1 z-10">
                  <Tag size={10} /> {effective.promoTitle}
                </div>
              )}

              <h4 className="text-sm font-black uppercase text-white mb-2">
                {product.name}
              </h4>

              <div className="mb-6">
                {effective.isDiscounted ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg font-black text-[#D4AF37]">
                      LKR {effective.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 line-through font-bold">
                      LKR {product.price.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <p className="text-lg font-black text-white">
                    LKR {product.price.toLocaleString()}
                  </p>
                )}
              </div>

              <button 
                onClick={() => toast.success("Added to cart")}
                className="w-full py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                Add to Cart
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ProductCatalog;