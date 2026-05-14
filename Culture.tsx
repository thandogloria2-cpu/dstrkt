
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from './supabase';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Culture: React.FC = () => {
  const [cultureItems, setCultureItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCulture = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('product_culture')
          .select('*')
          .order('id', { ascending: true });
        
        if (!error && data) {
          setCultureItems(data);
        }
      } catch (err) {
        console.error('Culture fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCulture();
  }, []);

  const heroItem = cultureItems[0];

  return (
    <main className="bg-black text-white">
      {/* Editorial Hero */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-end pb-12 md:pb-24 px-6 md:px-12">
        <div className="absolute inset-0 z-0">
          {heroItem && (
            <img 
              src={heroItem.image_url} 
              alt="Culture Hero" 
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        
        {/* Back Button at top */}
        <div className="absolute top-24 md:top-32 left-6 md:left-12 z-20">
          <Link 
            to="/" 
            className="group inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back Home
          </Link>
        </div>
        
        <div className="relative z-10 max-w-[1400px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
          >
            <p className="text-[10px] tracking-[1em] font-black text-[#D4AF37] uppercase mb-6 md:mb-8">Brand DNA</p>
            <h1 className="text-4xl sm:text-6xl md:text-[10vw] font-black tracking-tighter leading-[0.85] uppercase italic break-words">{heroItem?.title || 'District'}<br />Culture.</h1>
          </motion.div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-20 md:py-40 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-xl sm:text-3xl md:text-5xl font-bold leading-tight tracking-tight text-white/90 font-inter"
          >
            DSTRKT designs tools for movement.<br />
            Precision duffel bags shaped by urban culture, built for people who move with intent. Clean form. Durable construction. Quiet confidence.<br />
            <br />
            <span className="text-[#D4AF37] uppercase tracking-wider">CARRY THE CULTURE</span>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className="py-20 md:py-40 px-6 md:px-12 bg-black text-white border-t border-white/5">
        <div className="max-w-[1800px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8 md:space-y-12"
              >
                <h3 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none italic break-words">UTILITY &<br />IDENTITY.</h3>
                <p className="text-base md:text-xl leading-relaxed text-white/60 max-w-xl font-light">
                  We believe a duffel is more than storage, it's an extension of the self. Our design philosophy centers on 'The Unseen Detail' luxury that isn't loud, but is felt in every carry.
                </p>
                <div className="grid grid-cols-2 gap-8 md:gap-12 pt-8 md:pt-12">
                  <div className="space-y-4">
                    <p className="text-[10px] tracking-[0.4em] font-black uppercase text-[#D4AF37]">The Stitch</p>
                    <p className="text-xs uppercase font-bold leading-relaxed text-white/80">Hand-sewn reinforcements for infinite life cycles.</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] tracking-[0.4em] font-black uppercase text-[#D4AF37]">The Shell</p>
                    <p className="text-xs uppercase font-bold leading-relaxed text-white/80">Proprietary fabrics engineered to resist time.</p>
                  </div>
                </div>
              </motion.div>
              <div className="grid grid-cols-2 gap-6">
                {cultureItems.slice(1, 5).map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ scale: 1.1, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="aspect-[4/5] bg-[#0d0d0d] overflow-hidden border border-white/5"
                  >
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-100 transition-all duration-700 hover:scale-110"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-40 lg:py-60 text-center px-6">
        <h2 className="text-3xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 md:mb-12 italic">Join the Movement.</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] tracking-[0.4em] md:tracking-[0.6em] font-black uppercase">
          <a href="https://www.instagram.com/dstrkt00" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#D4AF37] transition-colors">Instagram</a>
          <a href="https://x.com/dstrkt00" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#D4AF37] transition-colors">X</a>
          <Link to="/vault" className="cursor-pointer hover:text-[#D4AF37] transition-colors">Vault Access</Link>
        </div>
      </section>
    </main>
  );
};

export default Culture;
