
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Droplets, Shield, Cpu, Layers, X, ExternalLink, Lock, Loader2, Clock } from 'lucide-react';
import { PRODUCTS, filterProducts } from './constants';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';
import { Product } from './types';
import { SEO } from './SEO';

const Home: React.FC = () => {
  const [selectedPiece, setSelectedPiece] = useState<any>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [cultureItems, setCultureItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Define the specific products we want to feature
        const featuredNames = ["SOUL REAPER", "BLOOD SPLATTER", "RED DRAGON", "Swarm Duffel"];
        
        // Fetch Featured Products from Supabase
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .in('name', featuredNames);

        let finalFeatured: Product[] = [];

        if (!prodError && prodData && prodData.length > 0) {
          const mapped: Product[] = prodData.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price_display,
            description: p.description,
            image: p.image_url,
            tag: p.tag
          }));
          
          // Sort to match the order in featuredNames
          finalFeatured = featuredNames
            .map(name => mapped.find(p => p.name.toUpperCase() === name.toUpperCase()))
            .filter((p): p is Product => p !== undefined);
        }

        // If we don't have all 4 from Supabase, fill in from local constants
        if (finalFeatured.length < 4) {
          const localFeatured = PRODUCTS.filter(p => 
            featuredNames.includes(p.name.toUpperCase())
          );
          
          // Merge and deduplicate by name
          const merged: Product[] = [...finalFeatured];
          localFeatured.forEach(lp => {
            if (!merged.some(mp => mp.name.toUpperCase() === lp.name.toUpperCase())) {
              merged.push(lp);
            }
          });

          // Final sort to maintain requested order
          finalFeatured = featuredNames
            .map(name => merged.find(p => p.name.toUpperCase() === name.toUpperCase()))
            .filter((p): p is Product => p !== undefined);
        }

        setFeaturedProducts(finalFeatured.slice(0, 4));

        // Fetch Culture Gallery Items
        const { data: cultData, error: cultError } = await supabase
          .from('product_culture')
          .select('*')
          .limit(6);

        if (!cultError && cultData) {
          setCultureItems(cultData);
        }
      } catch (err) {
        console.error('Home fetch failed:', err);
        setFeaturedProducts(filterProducts(PRODUCTS).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);



  const features = [
    { icon: Droplets, title: "Impermeable Shell", desc: "100% waterproof matte finish for all-weather deployment." },
    { icon: Shield, title: "High-Density Nylon Body", desc: "1050D ballistic nylon reinforcement throughout. Resistant to abrasion, puncture, and deformation — holds its structure fully loaded." },
    { icon: Lock, title: "Solid Brass Hardware", desc: "YKK zippers with antique brass pulls. Double-stitched D-rings and buckles. Smooth pull, no snagging — every open and close feels deliberate." },
    { icon: Clock, title: "Vegetable-Tanned Leather", desc: "Full-grain cowhide handles and base panel. Untreated surface that darkens and creases naturally with use — no two bags age identically." }
  ];

  return (
    <main className="bg-[#0a0a0a] overflow-x-hidden text-white">
      <SEO title="Home" description="DSTRKT - Premium luxury streetwear brand specializing in high-end duffel bags." />
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-10"></div>
          <motion.video 
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://www.image2url.com/r2/default/videos/1784727816972-2416c1b0-934e-4b9f-8383-bef8a1ca4174.mp4" 
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="relative z-20 text-center px-6"
        >
          <p className="text-[10px] md:text-xs tracking-[0.8em] font-bold text-[#D4AF37] mb-6 md:mb-8 uppercase">The New Standard</p>
          <h1 className="text-5xl sm:text-7xl md:text-[10vw] lg:text-[8vw] font-black tracking-[-0.04em] leading-[0.85] uppercase mb-8 md:mb-12 text-white">
            Carry<br />Culture.
          </h1>
          <Link to="/collections">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-black px-8 md:px-10 py-4 md:py-5 text-[10px] tracking-[0.4em] font-black uppercase flex items-center gap-4 mx-auto group overflow-hidden relative transition-colors"
            >
              <span className="relative z-10">Enter the collection</span>
              <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Manifesto Section */}
      <section className="py-16 md:py-32 px-6 md:px-12 bg-black border-y border-white/5 relative overflow-hidden flex items-center justify-center">
        <div className="max-w-[1800px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="text-[10px] md:text-xs tracking-[1em] font-black uppercase text-[#D4AF37] mb-16 pl-[1em] whitespace-nowrap inline-block">
              THE DISTRICT MANIFESTO
            </p>
            <h2 className="text-xl md:text-2xl lg:text-[2.2vw] font-black uppercase tracking-[0.5em] leading-tight text-white max-w-none mx-auto pl-[0.5em]">
              PREMIUM CRAFTSMENSHIP BUILT FOR MOVEMENT
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Release Section */}
      <section className="py-16 md:py-32 px-6 md:px-12 bg-[#050505] border-b border-white/5 relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto">
          <header className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-[10px] tracking-[0.6em] font-black uppercase text-[#D4AF37] mb-4">Upcoming</p>
              <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-none italic text-white">NEW RELEASE.</h2>
            </motion.div>
          </header>
          
          <div className="flex justify-center">
            <div className="w-full lg:w-2/3 xl:w-1/2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden border border-white/10 group"
              >
                <video 
                  src="https://www.image2url.com/r2/default/videos/1784728114607-70587ac6-4ce7-41af-b753-87b32fc4d7f0.mp4" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] font-black uppercase mb-2">COMING AUGUST 2026</p>
                  <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-widest leading-none">SCARFACE <br/> DUFFEL</h3>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.6em] font-black uppercase text-[#D4AF37] mb-4">Selected Works</p>
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none italic text-white">Featured.</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Link to="/collections" className="text-[11px] tracking-[0.5em] font-black uppercase text-white/60 hover:text-[#D4AF37] transition-colors flex items-center gap-4 group">
              View all duffels <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-[4/5] bg-[#0d0d0d] overflow-hidden mb-6 border border-white/5 gold-glow transition-all duration-500">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute bottom-6 left-6">
                      <p className="text-[10px] tracking-[0.3em] font-bold text-[#D4AF37] uppercase mb-1">{product.tag}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[11px] tracking-[0.4em] font-black uppercase text-white group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                    <p className="text-lg font-black text-white/90">{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* The Vault Section - Restored */}
      <section className="py-16 md:py-32 bg-[#050505] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-16">
          <div className="max-w-2xl text-left">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-black uppercase mb-6 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[#D4AF37]"></span> Restricted Access
            </p>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic mb-10 leading-none">The<br />Vault.</h2>
            <p className="text-white/40 text-lg leading-relaxed font-light italic mb-12 border-l-2 border-[#D4AF37] pl-8 max-w-xl">
              Our archive of limited editions and experimental prototypes. Locked for exclusive members. Register to be a member to receive exclusive priority.
            </p>
            <Link to="/vault" className="hidden md:block">
              <button className="bg-white text-black px-12 py-6 text-[11px] tracking-[0.5em] font-black uppercase hover:bg-[#D4AF37] transition-all flex items-center gap-4">
                Access Archive <Lock size={16} />
              </button>
            </Link>
          </div>
          
          <div className="bg-black border border-white/10 flex items-center justify-center relative w-full md:w-[450px] aspect-[4/3] md:aspect-auto overflow-hidden">
             <img src="https://www.image2url.com/r2/default/images/1778947264137-b7700830-6c4c-4ab0-89ad-5503c43093d9.jpg" alt="Vault" loading="lazy" className="w-full h-full object-cover" />
          </div>

          <Link to="/vault" className="md:hidden w-full">
            <button className="bg-white text-black px-12 py-6 text-[11px] tracking-[0.5em] font-black uppercase hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-4 w-full">
              Access Archive <Lock size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* Technical Materials Section - Restored */}
      <section className="pt-16 md:pt-32 pb-8 md:pb-16 px-6 md:px-12 max-w-[1800px] mx-auto">
        <header className="mb-12 md:mb-16 max-w-4xl">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.6em] font-black uppercase text-[#D4AF37] mb-4">Technical Specifications</p>
            <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-none italic text-white mb-10">Materials.</h2>
            <p className="text-white/40 text-lg md:text-xl leading-relaxed font-light italic border-l-2 border-[#D4AF37] pl-8">
              Architectural integrity meets textile craft. Every component is selected for how it performs, how it feels, and how it holds up over years, not seasons.
            </p>
          </motion.div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
            >
              <f.icon size={32} className="text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h4 className="text-[11px] tracking-[0.4em] font-black uppercase text-white mb-4">{f.title}</h4>
              <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-[0.1em] font-bold">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Culture Section */}
      <section className="pt-8 md:pt-16 pb-16 md:pb-32 px-6 md:px-12 max-w-[1800px] mx-auto overflow-hidden">
        <header className="mb-12 md:mb-16">
          <p className="text-[10px] tracking-[0.6em] font-black uppercase text-[#D4AF37] mb-4">The District Archive</p>
          <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-none italic text-white">Culture.</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[300px] md:auto-rows-[400px]">
          {cultureItems.map((item, i) => (
            <motion.div
              layout
              key={item.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`relative group overflow-hidden border border-white/10 ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
            >
              <img src={item.image_url} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 md:p-12">
                <p className="text-[10px] tracking-[0.4em] font-black text-[#D4AF37] uppercase mb-2">{item.tag || item.collection || 'DISTRICT'}</p>
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-8 leading-none italic text-white">{item.title}</h3>
                <button onClick={() => setSelectedPiece(item)} className="text-[10px] tracking-[0.6em] font-black uppercase text-white border-b border-white pb-2 w-fit hover:text-[#D4AF37] transition-all">
                  View Piece
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPiece && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-24"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setSelectedPiece(null)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl h-auto max-h-[90vh] flex flex-col lg:flex-row bg-[#0d0d0d] border border-white/10 overflow-hidden"
            >
              <button 
                onClick={() => setSelectedPiece(null)} 
                className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] text-white/40 hover:text-white bg-black/40 p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <X size={24} className="md:w-8 md:h-8" />
              </button>
              
              <div className="w-full lg:w-3/5 bg-black flex items-center justify-center min-h-[50vh] lg:min-h-[70vh] relative overflow-hidden">
                <img 
                  src={selectedPiece.image_url || selectedPiece.image} 
                  alt={selectedPiece.title || selectedPiece.name} 
                  className="max-w-full max-h-full object-contain p-4 lg:p-8" 
                />
              </div>
              
              <div className="w-full lg:w-2/5 p-8 md:p-12 flex flex-col justify-center overflow-y-auto bg-[#0d0d0d]">
                <p className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-black uppercase mb-6">{selectedPiece.tag || 'DSTRKT'}</p>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-white mb-8 leading-[0.9]">{selectedPiece.title || selectedPiece.name}</h2>
                <p className="text-white/60 text-sm md:text-base leading-relaxed font-light italic mb-10 border-l-2 border-[#D4AF37] pl-6">"{selectedPiece.description}"</p>
                {selectedPiece.product_id && (
                  <Link to={`/product/${selectedPiece.product_id}`} onClick={() => setSelectedPiece(null)}>
                    <button className="w-full bg-white text-black py-5 text-[10px] tracking-[0.5em] font-black uppercase hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-4">
                      Explore Product <ExternalLink size={16} />
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Home;
