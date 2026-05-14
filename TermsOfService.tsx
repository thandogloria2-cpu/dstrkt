import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <main className="bg-[#0a0a0a] min-h-screen pt-24 md:pt-40 pb-20 md:pb-32 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <header className="mb-12 md:mb-24">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-black uppercase mb-6 md:mb-8">Legal & Policy</p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-white break-words">Terms Of Service.</h1>
        </header>

        <div className="space-y-12">
          {[
            { 
              title: 'Use of Service', 
              content: 'By accessing DSTRKT, you agree to comply with these terms. Our services are intended for personal, non-commercial use. You are responsible for maintaining the confidentiality of your account credentials.' 
            },
            { 
              title: 'Intellectual Property', 
              content: 'All content on this site, including designs, text, graphics, and logos, is the property of DSTRKT and is protected by international copyright laws. Unauthorized use of our intellectual property is strictly prohibited.' 
            },
            { 
              title: 'Product Information', 
              content: 'We strive for accuracy in our product descriptions and pricing. However, we reserve the right to correct any errors and to change or update information at any time without prior notice.' 
            },
            { 
              title: 'Limitation of Liability', 
              content: 'DSTRKT shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services or products.' 
            },
            { 
              title: 'Return Service', 
              content: 'We offer a 30-day return service. Items must be in original packaging with security tags intact. For more details, please visit our Support page.' 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group border-b border-white/5 pb-12"
            >
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6 group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-bold max-w-2xl">
                {item.content}
              </p>
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

export default TermsOfService;
