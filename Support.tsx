import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <main className="bg-[#0a0a0a] min-h-screen pt-24 md:pt-40 pb-20 md:pb-32 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <header className="mb-12 md:mb-24">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-black uppercase mb-6 md:mb-8">Service & Policy</p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-white break-words">Support.</h1>
        </header>

        <div className="space-y-12">
          {[
            { q: 'What is the DSTRKT Lifetime Warranty?', a: 'Every DSTRKT piece is guaranteed for life against manufacturing defects in stitching, zippers, and hardware.' },
            { q: 'How do Vault drops work?', a: 'Vault drops are released at random intervals. Members receive a 24-hour head start via private link. Once a Vault item is marked "Archive," it will never be reproduced.' },
            { q: 'Shipping and global logistics?', a: 'We offer complimentary express shipping to 120+ countries. All orders are processed from our District Hub within 48 hours of purchase.' },
            { q: 'Return policy?', a: 'We offer a 30-day return service. Items must be in original packaging with security tags intact.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group border-b border-white/5 pb-12"
            >
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6 group-hover:text-[#D4AF37] transition-colors">{item.q}</h3>
              <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold max-w-2xl">{item.a}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 md:mt-32 p-8 md:p-12 bg-white text-black">
          <h4 className="text-[10px] tracking-[0.5em] font-black uppercase mb-6 md:mb-8">Need human assistance?</h4>
          <p className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic mb-6 md:mb-8">Our support team is standing by.</p>
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=dstrkt.shop@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base md:text-lg font-light tracking-tight mb-8 block hover:text-[#D4AF37] transition-colors"
          >
            dstrkt.shop@gmail.com
          </a>
          <div className="flex gap-8 text-[10px] font-black tracking-widest uppercase">
            <span>MON — FRI</span>
            <span>09:00 — 18:00 EST</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Support;