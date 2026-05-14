
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, ShoppingBag, Eye, ShieldAlert, BadgeCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS, filterProducts } from './constants';
import { useCart } from './CartContext';
import { supabase, isSupabaseConfigured } from './supabase';
import { Product } from './types';

const PrivateShop: React.FC = () => {
  const { addToCart } = useCart();
  const [vaultProducts, setVaultProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
    };
    fetchUser();

    const fetchVaultShop = async () => {
      setLoading(true);
      try {
        if (!isSupabaseConfigured) {
          setVaultProducts(filterProducts(PRODUCTS).filter(p => p.tag === 'VAULT'));
          setLoading(false);
          return;
        }

        // Fetch from vault_drops as requested
        const { data, error } = await supabase
          .from('vault_drops')
          .select('*')
          .order('release_date', { ascending: false });

        if (error || !data || data.length === 0) {
          setVaultProducts(filterProducts(PRODUCTS).filter(p => p.tag === 'VAULT' && p.name !== 'GOLD RUNNER'));
        } else {
          const mapped = data
            .filter(d => d.name !== 'GOLD RUNNER' && (d.status === 'active' || !d.status)) // Only active items in shop, exclude Gold Runner
            .map(d => ({
              id: d.id,
              name: d.name,
              price: '$280', 
              description: d.description,
              image: d.image_url,
              tag: 'VAULT'
            }));
          setVaultProducts(filterProducts(mapped));
        }
      } catch (err) {
        console.error('Vault Shop fetch failed:', err);
        setVaultProducts(filterProducts(PRODUCTS).filter(p => p.tag === 'VAULT'));
      } finally {
        setLoading(false);
      }
    };

    fetchVaultShop();
  }, []);

  return (
    <main className="bg-[#050505] min-h-screen pt-24 md:pt-40 pb-20 md:pb-32 selection:bg-[#D4AF37] selection:text-black relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-[#D4AF37]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-[#D4AF37]/3 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
        <Link to="/vault" className="inline-flex items-center gap-4 text-[10px] tracking-[0.5em] font-black uppercase text-white/40 hover:text-[#D4AF37] mb-12 md:mb-20 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Exit Private Shop
        </Link>

        <header className="mb-16 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="bg-[#D4AF37] p-3 shrink-0">
                <ShieldAlert size={20} className="text-black" />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] md:tracking-[0.8em] font-black uppercase truncate">Level 04 Clearance Required</p>
                <div className="flex flex-wrap items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-widest break-words">
                  <BadgeCheck size={12} className="text-[#D4AF37] shrink-0" /> Verified Operative: {profile?.full_name || user?.email?.split('@')[0].toUpperCase() || 'GUEST'}
                </div>
              </div>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-[-0.05em] uppercase mb-8 md:mb-12 italic leading-none break-words">
              Vault<br />Shop.
            </h1>
            <p className="text-white/40 text-base md:text-xl leading-relaxed font-light max-w-2xl border-l-2 border-[#D4AF37] pl-6 md:pl-8">
              Exclusive archive editions and prototype releases. These pieces represent the pinnacle of Carry Culture—available only to verified District operatives.
            </p>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20 md:py-40">
            <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24">
            <AnimatePresence mode="popLayout">
              {vaultProducts.map((product, i) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group relative"
                >
                  <div className="relative aspect-[3/4] bg-[#0d0d0d] overflow-hidden mb-8 border border-white/5 transition-all duration-700 hover:border-[#D4AF37]/30">
                    <img 
                      src={product.image || 'https://via.placeholder.com/800x1000?text=DSTRKT+VAULT'} 
                      alt={product.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6 backdrop-blur-md">
                      <button 
                        onClick={() => addToCart(product, 1)}
                        className="px-10 py-5 bg-white text-black hover:bg-[#D4AF37] text-[10px] tracking-[0.4em] font-black uppercase transition-all flex items-center gap-3"
                      >
                        <ShoppingBag size={14} /> Buy Now
                      </button>
                      <Link to={`/product/${product.id}`}>
                        <button className="text-[9px] tracking-[0.5em] font-black uppercase text-white/60 hover:text-white transition-colors flex items-center gap-2">
                          <Eye size={12} /> View Schematics
                        </button>
                      </Link>
                    </div>

                    <div className="absolute top-8 left-8">
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]"></div>
                    </div>
                    
                    <div className="absolute top-8 right-8">
                      <p className="text-[8px] tracking-[0.4em] font-black text-white/20 uppercase font-mono">CODE: {product.id.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="space-y-4 px-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] tracking-[0.4em] font-black uppercase mb-1 text-[#D4AF37]">
                          {product.tag}
                        </p>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                      </div>
                      <p className="text-xl font-black text-white/80">{product.price}</p>
                    </div>
                    <p className="text-[11px] text-white/30 leading-relaxed uppercase tracking-widest font-bold line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Exclusive Footer */}
        <section className="mt-20 md:mt-60 py-20 md:py-40 border-t border-white/5 text-center bg-[#070707] -mx-6 md:-mx-12 px-6 md:px-12">
          <Lock size={48} className="text-[#D4AF37] mx-auto mb-8 md:mb-12 animate-pulse" strokeWidth={1} />
          <h2 className="text-3xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter italic mb-8">End of Session.</h2>
          <p className="text-white/30 text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] font-black uppercase max-w-2xl mx-auto leading-loose border-y border-white/5 py-8 md:py-12">
            The Private Shop contains strictly non-public inventory. All digital signatures are tracked and unique to your membership ID. Do not share access links.
          </p>
        </section>
      </div>
    </main>
  );
};

export default PrivateShop;
