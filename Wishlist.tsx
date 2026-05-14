import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from './constants';
import { useCart } from './CartContext';

const Wishlist: React.FC = () => {
  const { addToCart } = useCart();
  // Using some mock wishlist items derived from existing products for visual demonstration
  const wishlistItems = PRODUCTS.slice(0, 2);

  return (
    <main className="bg-black min-h-screen pt-24 md:pt-40 pb-20 md:pb-32 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <Link to="/account" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-12 md:mb-20 transition-colors">
          <ArrowLeft size={16} /> Back to Account
        </Link>

        <header className="mb-16 md:mb-24">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-black uppercase mb-6 md:mb-8">Personal Archive</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white">Desired.</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {wishlistItems.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[4/5] bg-[#0d0d0d] overflow-hidden mb-6 border border-white/5 gold-glow transition-all">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white text-black p-3 rounded-full hover:bg-[#D4AF37] transition-colors shadow-xl">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight mb-1">{product.name}</h3>
                  <p className="text-[#D4AF37] font-black">{product.price}</p>
                </div>
                <button 
                  onClick={() => addToCart(product, 1)}
                  className="w-full py-4 bg-white/5 border border-white/10 text-[10px] tracking-[0.4em] font-black uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                >
                  Move to Bag <Plus size={14} />
                </button>
              </div>
            </motion.div>
          ))}
          {wishlistItems.length === 0 && (
            <div className="col-span-full py-40 text-center border border-white/5 border-dashed">
              <p className="text-[10px] tracking-[0.5em] font-bold text-white/20 uppercase italic">Your wishlist is currently void.</p>
              <Link to="/collections" className="inline-block mt-8 text-[10px] tracking-[0.3em] font-black text-white hover:text-[#D4AF37] uppercase border-b border-[#D4AF37] pb-1">Browse Collections</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Wishlist;