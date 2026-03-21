import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit, Trash2, Box } from 'lucide-react';

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/products/all")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching stock"));
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-2">Registry</p>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Current Stock</h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
          <input 
            type="text" 
            placeholder="SEARCH INVENTORY..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 py-3 pl-10 pr-6 text-[10px] tracking-widest outline-none focus:border-[#D4AF37]/50 w-80 uppercase"
          />
        </div>
      </div>

      <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] tracking-[0.3em] uppercase text-gray-500 font-bold">
              <th className="p-6">Asset Visual</th>
              <th className="p-6">Product Identity</th>
              <th className="p-6">Category</th>
              <th className="p-6">Pricing</th>
              <th className="p-6">Availability</th>
              <th className="p-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="w-12 h-12 bg-black border border-white/10 overflow-hidden relative group-hover:border-[#D4AF37]/50 transition-colors">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-6 font-bold uppercase tracking-tight">{product.name}</td>
                <td className="p-6 text-gray-500 uppercase text-xs">{product.category}</td>
                <td className="p-6 font-mono text-[#D4AF37]">LKR {product.price}</td>
                <td className="p-6">
                   <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${product.stockQuantity > 5 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                     {product.stockQuantity} IN STOCK
                   </span>
                </td>
                <td className="p-6">
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-500 hover:text-[#D4AF37]"><Edit size={16}/></button>
                    <button className="text-gray-500 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default InventoryList;