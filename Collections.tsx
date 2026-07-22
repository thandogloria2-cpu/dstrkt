import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, SlidersHorizontal, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from './supabase';
import { Product } from './types';
import { PRODUCTS, filterProducts } from './constants';
import { SEO } from './SEO';

const Collections: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ['ALL'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // We always attempt the fetch if it looks like we might have a URL
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_vault_item', false);

        if (error || !data || data.length === 0) {
          // Silent fallback to local data if Supabase is empty or unreachable
          setProducts(filterProducts(PRODUCTS).filter(p => p.tag !== 'VAULT'));
        } else {
          const mapped: Product[] = data.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price_display,
            description: p.description,
            image: p.image_url,
            tag: p.tag
          }));
          
          let filtered = filterProducts(mapped);
          
          // Merge local products not present in the database (e.g., newly added ones like Cigarettes Duffel)
          const localProducts = filterProducts(PRODUCTS).filter(p => p.tag !== 'VAULT');
          localProducts.forEach(lp => {
            if (!filtered.some(p => p.id === lp.id || p.name === lp.name)) {
              filtered.push(lp);
            }
          });
          
          // Custom swap logic: Start with Soul Reaper and put Urban Voyager II where Soul Reaper was
          const srIndex = filtered.findIndex(p => p.name.toUpperCase() === 'SOUL REAPER');
          const uvIndex = filtered.findIndex(p => p.name.toUpperCase() === 'URBAN VOYAGER II');
          
          if (srIndex !== -1 && uvIndex !== -1) {
            const result = [...filtered];
            const temp = result[srIndex];
            result[srIndex] = result[uvIndex];
            result[uvIndex] = temp;
            setProducts(result);
          } else {
            setProducts(filtered);
          }
        }
      } catch (err) {
        // Graceful error handling - show local data instead of a crash
        setProducts(filterProducts(PRODUCTS).filter(p => p.tag !== 'VAULT'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = filter === 'ALL' 
    ? products 
    : products.filter(p => p.tag === filter);

  return (
    <main className="bg-black pt-24 md:pt-40 pb-20 md:pb-32 min-h-screen selection:bg-[#D4AF37] selection:text-black">
      <SEO title="Collection" description="Discover DSTRKT's exclusive range of high-end, luxury duffel bags designed for street culture connoisseurs." />
      <header className="max-w-[1800px] mx-auto px-6 md:px-12 mb-12 md:mb-24">
        <Link to="/" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-bold mb-6 md:mb-8 uppercase">Archive & Essential</p>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-[-0.05em] uppercase mb-8 md:mb-12 leading-none break-words">The<br />Collection.</h1>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pt-8 md:pt-12 border-t border-white/5">
          <div className="flex flex-wrap gap-8 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] tracking-[0.4em] font-bold uppercase transition-all duration-500 relative py-2 ${filter === cat ? 'text-white' : 'text-white/30 hover:text-white'}`}
              >
                {cat}
                {filter === cat && (
                  <motion.div layoutId="activeCat" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#D4AF37]" />
                )}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-4 text-[10px] tracking-[0.4em] font-bold text-white/40 hover:text-white uppercase transition-colors">
            <SlidersHorizontal size={14} /> Filter & Sort
          </button>
        </div>
      </header>

      <section className="max-w-[1800px] mx-auto px-6 md:px-12">
        {loading ? (
          <div className="flex items-center justify-center py-20 md:py-40">
            <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24"
          >
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-[3/4] bg-[#0d0d0d] overflow-hidden mb-8 border border-white/5 gold-glow transition-all">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" 
                      />
                      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white text-black p-4 rounded-full">
                          <Plus size={20} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black uppercase tracking-tighter italic">{product.name}</h3>
                      <p className="text-lg font-bold text-white/60">{product.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </main>
  );
};

export default Collections;