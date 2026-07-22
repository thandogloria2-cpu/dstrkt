import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Instagram, Twitter, Globe, Trash2, ChevronRight, User, Loader2 } from 'lucide-react';
import Home from './Home';
const Vault = lazy(() => import('./Vault'));
const PrivateShop = lazy(() => import('./PrivateShop'));
const ProductDetail = lazy(() => import('./ProductDetail'));
const Collections = lazy(() => import('./Collections'));
const Culture = lazy(() => import('./Culture'));
const Craftsmanship = lazy(() => import('./Craftsmanship'));
const Journal = lazy(() => import('./Journal'));
const Support = lazy(() => import('./Support'));
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'));
const TermsOfService = lazy(() => import('./TermsOfService'));
const Checkout = lazy(() => import('./Checkout'));
const Account = lazy(() => import('./Account'));
const Profile = lazy(() => import('./Profile'));
const Orders = lazy(() => import('./Orders'));
const Wishlist = lazy(() => import('./Wishlist'));
import { CartProvider, useCart } from './CartContext';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const DynamicCanonical: React.FC = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link') as HTMLLinkElement;
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://dstrkt.co.za${pathname}`);
  }, [pathname]);
  
  return null;
};

const CartSidebar: React.FC = () => {
  const { items, removeFromCart, updateQuantity, subtotal, isCartOpen, setCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0d0d0d] border-l border-white/10 z-[80] flex flex-col shadow-2xl"
          >
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-[10px] tracking-[0.5em] font-black uppercase text-white">Your Bag</h2>
              <button onClick={() => setCartOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} strokeWidth={1} className="text-white/10 mb-6" />
                  <p className="text-[10px] tracking-[0.3em] font-bold text-white/30 uppercase italic">Your bag is currently empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 md:gap-6 group">
                    <div className="w-16 h-20 md:w-20 md:h-24 bg-[#111] border border-white/5 shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-[10px] tracking-wider font-bold uppercase text-white line-clamp-1">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/20 hover:text-[#D4AF37] transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                         <p className="text-[9px] text-white/40 uppercase tracking-widest">Qty:</p>
                         <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="bg-[#111] border border-white/10 w-6 h-6 flex items-center justify-center text-white hover:border-[#D4AF37] transition-all"
                         >
                           -
                         </button>
                         <p className="text-[11px] text-white tracking-widest w-6 text-center">{item.quantity}</p>
                         <button 
                            onClick={() => updateQuantity(item.id, Math.min(100, item.quantity + 1))} 
                            className="bg-[#111] border border-white/10 w-6 h-6 flex items-center justify-center text-white hover:border-[#D4AF37] transition-all"
                         >
                           +
                         </button>
                      </div>
                      <p className="text-[11px] font-bold text-[#D4AF37]">{item.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 md:p-8 border-t border-white/5 bg-black/40">
                <div className="flex justify-between items-end mb-6 md:mb-8">
                  <span className="text-[10px] tracking-[0.4em] font-bold text-white/40 uppercase">Subtotal</span>
                  <span className="text-lg md:text-xl font-black text-white">${subtotal.toLocaleString()}</span>
                </div>
                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  <button className="w-full bg-white text-black py-4 md:py-5 text-[10px] tracking-[0.5em] font-black uppercase hover:bg-[#D4AF37] transition-colors">
                    Checkout Now
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Navbar: React.FC<{ onOpenMenu: () => void }> = ({ onOpenMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setCartOpen } = useCart();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-black/40 md:bg-transparent py-4 md:py-8'}`}>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-white font-bebas">DSTRKT</Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/collections" className="text-[10px] tracking-[0.4em] font-bold text-white/40 hover:text-white transition-colors uppercase">Collection</Link>
            <Link to="/vault" className="text-[10px] tracking-[0.4em] font-bold text-white/40 hover:text-[#D4AF37] transition-colors uppercase flex items-center gap-2">The Vault <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></span></Link>
            <Link to="/culture" className="text-[10px] tracking-[0.4em] font-bold text-white/40 hover:text-white transition-colors uppercase">Culture</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/account" className="text-white hover:text-[#D4AF37] transition-colors">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <button onClick={() => setCartOpen(true)} className="text-white hover:text-[#D4AF37] transition-colors relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button 
            onClick={onOpenMenu}
            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const MenuOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: '-100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          className="fixed inset-0 z-[60] bg-black flex flex-col"
        >
          <div className="flex justify-between items-center p-6 md:p-12">
            <Link to="/" onClick={onClose} className="text-4xl md:text-5xl font-black tracking-tighter font-bebas">DSTRKT</Link>
            <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-white/10 hover:border-white transition-colors">
              <X size={20} md:size={24} />
            </button>
          </div>
          
          <div className="flex-grow flex flex-col md:flex-row items-center justify-center px-6 md:px-12 gap-12 md:gap-20">
            <nav className="flex flex-col items-center md:items-start gap-4 md:gap-8 text-center md:text-left overflow-y-auto max-h-[60vh] md:max-h-[70vh] py-6 md:py-10">
              {[
                { name: 'Collection', path: '/collections' },
                { name: 'The Vault', path: '/vault' },
                { name: 'Culture', path: '/culture' },
                { name: 'Journal', path: '/journal' },
                { name: 'Account', path: '/account' }
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                >
                  <Link 
                    to={item.path} 
                    onClick={onClose}
                    className="text-3xl sm:text-4xl md:text-8xl font-black uppercase tracking-tighter hover:text-[#D4AF37] transition-colors leading-none"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="hidden lg:block w-[1px] h-96 bg-white/10"></div>
            <div className="flex flex-col gap-6 md:gap-8 text-center md:text-left pb-12 md:pb-0">
              <div className="space-y-2">
                <p className="text-[10px] tracking-[0.5em] font-bold text-white/30 uppercase">Contact</p>
                <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=dstrkt.shop@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base md:text-lg font-light tracking-tight hover:text-[#D4AF37] transition-colors"
            >
              dstrkt.shop@gmail.com
            </a>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.5em] font-bold text-white/30 uppercase">Follow</p>
                <div className="flex gap-6 justify-center md:justify-start items-center">
                  <a href="https://www.instagram.com/dstrkt00/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
                    <Instagram size={20} md:size={24} />
                  </a>
                  <a href="https://x.com/DSTRKT00" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors font-black uppercase" style={{ fontSize: '20px' }}>
                    X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/5 py-24 px-6 md:px-12">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="space-y-8">
          <span className="text-4xl font-black tracking-tighter font-bebas">DSTRKT</span>
          <p className="text-white/40 text-[9px] leading-relaxed uppercase tracking-[0.3em]">
            Defined by the street.<br />Refined by craftsmanship.<br />Born in the District.
          </p>
        </div>
        <div>
          <h5 className="text-[10px] tracking-[0.5em] font-bold text-white mb-8 uppercase">Navigation</h5>
          <ul className="space-y-4 text-[9px] tracking-[0.3em] font-bold text-white/40 uppercase">
            <li><Link to="/collections" className="hover:text-white transition-colors">Collection</Link></li>
            <li><Link to="/vault" className="hover:text-white transition-colors">The Vault</Link></li>
            <li><Link to="/journal" className="hover:text-white transition-colors">Journal</Link></li>
            <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-[10px] tracking-[0.5em] font-bold text-white mb-8 uppercase">Legal</h5>
          <ul className="space-y-4 text-[9px] tracking-[0.3em] font-bold text-white/40 uppercase">
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-[10px] tracking-[0.5em] font-bold text-white mb-8 uppercase">Newsletter</h5>
          <div className="flex border-b border-white/20 pb-2 mb-4 group focus-within:border-white transition-colors">
            <input 
              type="email" 
              placeholder="JOIN THE DISTRICT" 
              className="bg-transparent border-none outline-none text-[10px] tracking-[0.3em] w-full text-white placeholder:text-white/20 uppercase font-black"
            />
            <button className="text-white/40 hover:text-[#D4AF37] transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
      <div className="max-w-[1800px] mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] tracking-[0.4em] font-bold text-white/20 uppercase">
        <p>&copy; 2025 DSTRKT GLOBAL. ALL RIGHTS RESERVED.</p>
        <p>HANDCRAFTED FOR THE CULTURE MOVERS.</p>
      </div>
    </footer>
  );
};

const AppLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
      <ScrollToTop />
      <DynamicCanonical />
      <Navbar onOpenMenu={() => setIsMenuOpen(true)} />
      <CartSidebar />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white"><Loader2 className="animate-spin text-[#D4AF37]" size={40} /></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/vault/shop" element={<PrivateShop />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/craftsmanship" element={<Craftsmanship />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/profile" element={<Profile />} />
            <Route path="/account/orders" element={<Orders />} />
            <Route path="/account/wishlist" element={<Wishlist />} />
          </Routes>
        </Suspense>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <AppLayout />
      </Router>
    </CartProvider>
  );
};

export default App;