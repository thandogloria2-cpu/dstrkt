import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Craftsmanship: React.FC = () => {
  return (
    <main className="bg-black pt-24 md:pt-40 min-h-screen">
      <section className="px-6 md:px-12 max-w-[1800px] mx-auto mb-16 md:mb-32">
        <Link to="/" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-black uppercase mb-6 md:mb-8"
        >
          Engineering Excellence
        </motion.p>
        <h1 className="text-5xl sm:text-7xl md:text-[10vw] font-black tracking-tighter uppercase leading-[0.8] mb-12 md:mb-24 break-words">Built For<br />The Long<br />Night.</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 items-start">
          <div className="lg:col-span-4 space-y-8 md:space-y-16">
            <div className="p-8 md:p-12 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-4 md:mb-6 tracking-tight">01. Obsidian Leather</h3>
              <p className="text-white/40 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 uppercase tracking-widest font-bold">
                Sourced from the heart of Tuscany. Our TAPE FUSION leather undergoes a 24-month tanning process to achieve its deep matte-obsidian finish.
              </p>
              <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.4em]">ORIGIN: ITALY</span>
            </div>
            <div className="p-8 md:p-12 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-4 md:mb-6 tracking-tight">02. Ballistic Mesh</h3>
              <p className="text-white/40 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 uppercase tracking-widest font-bold">
                Military-spec reinforcement weave that provides 10x the puncture resistance of standard MIDNIGHT RUN nylon. Designed to endure urban transit.
              </p>
              <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.4em]">GRADE: MIL-B-817</span>
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <div className="aspect-[16/9] bg-[#0d0d0d] overflow-hidden border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2940&auto=format&fit=crop" 
                alt="Material Close-up" 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-8 text-[10px] tracking-[0.4em] font-bold text-white/30 uppercase italic text-right">Micro-detail: Model Catalyst reinforcement structure</p>
          </div>
        </div>
      </section>

      {/* Full Width Visual */}
      <section className="h-[60vh] md:h-screen bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1614165933833-97a9060ee3b2?q=80&w=2787&auto=format&fit=crop)' }}>
        <div className="w-full h-full bg-black/60 flex items-center justify-center p-6 md:p-12">
          <h2 className="text-2xl sm:text-4xl md:text-8xl font-black uppercase tracking-tighter text-center max-w-4xl italic">Every stitch is a promise of permanence.</h2>
        </div>
      </section>
    </main>
  );
};

export default Craftsmanship;