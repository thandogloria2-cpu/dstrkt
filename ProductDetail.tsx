
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, EXCLUDED_PRODUCT_NAMES } from './constants';
import { 
  ArrowLeft, Plus, Minus, ShieldCheck, Truck, RotateCcw, 
  Check, ShoppingBag, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import { useCart } from './CartContext';
import { supabase, isSupabaseConfigured } from './supabase';
import { Product } from './types';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        if (!isSupabaseConfigured || !id) {
          const localProduct = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
          setProduct(localProduct);
          setGallery(localProduct.gallery || []);
          setLoading(false);
          return;
        }

        // Fetch Product
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (prodError || !prodData) {
          // Try fetching from vault_drops
          const { data: vaultData, error: vaultError } = await supabase
            .from('vault_drops')
            .select('*')
            .eq('id', id)
            .single();

          if (vaultError || !vaultData) {
            const localFallback = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
            setProduct(localFallback);
            setGallery(localFallback.gallery || []);
          } else {
            setProduct({
              id: vaultData.id,
              name: vaultData.name,
              price: '$280', // Standard price for vault items
              description: vaultData.description,
              image: vaultData.image_url,
              tag: 'VAULT'
            });
            setGallery([]); // Vault drops might not have a gallery in the current schema
          }
        } else {
          // Check if excluded
          if (EXCLUDED_PRODUCT_NAMES.some(excluded => prodData.name.toLowerCase().includes(excluded.toLowerCase()))) {
            setProduct(null);
            setLoading(false);
            return;
          }
          setProduct({
            id: prodData.id,
            name: prodData.name,
            price: prodData.price_display,
            description: prodData.description,
            image: prodData.image_url,
            tag: prodData.tag,
            stock: prodData.stock ?? 10
          });

          // Fetch Gallery
          const { data: gallData } = await supabase
            .from('product_gallery')
            .select('image_url')
            .eq('product_id', id)
            .order('display_order', { ascending: true });

          if (gallData) {
            let images = gallData.map(g => g.image_url);
            if (prodData.name === 'Swarm Duffel') {
              images.push('https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Swarm%20Duffel%202.png');
            }
            setGallery(images);
          } else if (prodData.name === 'Swarm Duffel') {
            setGallery(['https://bjylzveziwmocmlfyfgm.supabase.co/storage/v1/object/public/Assets/Swarm%20Duffel%202.png']);
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
      </div>
    );
  }

  if (!product || EXCLUDED_PRODUCT_NAMES.some(excluded => product.name.toLowerCase().includes(excluded.toLowerCase()))) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Product Not Found</h2>
        <Link to="/collections">
          <button className="bg-white text-black px-12 py-6 text-[11px] tracking-[0.5em] font-black uppercase hover:bg-[#D4AF37] transition-all">
            Return to Collection
          </button>
        </Link>
      </div>
    );
  }

  const isVaultItem = product.tag === 'VAULT';
  const backToPath = isVaultItem ? '/vault' : '/collections';
  const backToLabel = isVaultItem ? 'BACK TO VAULT' : 'Back to Collection';
  const allSlides = [product.image, ...gallery];

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 2000);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % allSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length);

  return (
    <main className="bg-black min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <Link 
          to={backToPath} 
          className="inline-flex items-center gap-3 text-[10px] tracking-[0.4em] font-bold text-white/40 hover:text-white transition-colors uppercase mb-8 md:mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {backToLabel}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 xl:gap-24">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 md:space-y-8">
            <div className="relative h-[600px] w-full bg-[#0d0d0d] border border-white/5 overflow-hidden group">
              <div className="w-full h-full relative overflow-hidden touch-pan-y">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                    className="w-full h-full"
                  >
                    <img 
                      src={allSlides[currentSlide]} 
                      alt={`${product.name} view ${currentSlide + 1}`} 
                      className="w-full h-full object-contain pointer-events-none select-none"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <button 
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-[#D4AF37] hover:text-black"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex hover:bg-[#D4AF37] hover:text-black"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {allSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1 transition-all duration-500 ${currentSlide === idx ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {allSlides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`aspect-square bg-[#0d0d0d] border transition-all duration-500 overflow-hidden ${currentSlide === idx ? 'border-[#D4AF37] opacity-100' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  <img src={slide} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-40">
              <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] font-black uppercase mb-4">{product.tag || 'NEW ARRIVAL'}</p>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 md:mb-6 leading-none">
                {product.name === 'Swarm Duffel' && currentSlide === 1 ? 'Swarm Duffel 02' : product.name}
              </h1>
              <p className="text-xl md:text-2xl font-black text-white mb-6 md:mb-8">{product.price}</p>
              {product.stock !== undefined && (
                <p className="text-[12px] font-bold text-[#D4AF37] mb-6 md:mb-8 tracking-widest uppercase">
                  {product.stock > 0 ? `Only ${product.stock} items left in stock!` : 'Out of stock!'}
                </p>
              )}
              <div className="w-full h-[1px] bg-white/10 mb-6 md:mb-8"></div>
              <p className="text-white/60 text-sm md:text-base font-light leading-relaxed mb-8 md:mb-12">{product.description}</p>

              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-6 md:gap-8">
                  <span className="text-[10px] tracking-[0.4em] font-bold text-white/40 uppercase">Quantity</span>
                  <div className="flex items-center border border-white/10 bg-white/5">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 md:p-4 text-white/40 hover:text-white"><Minus size={14} /></button>
                    <span className="w-10 md:w-12 text-center text-[11px] font-black">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 md:p-4 text-white/40 hover:text-white"><Plus size={14} /></button>
                  </div>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding || (product.stock !== undefined && product.stock <= 0)}
                  className={`w-full py-5 md:py-6 text-[11px] tracking-[0.5em] font-black uppercase transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group
                    ${isAdding || (product.stock !== undefined && product.stock <= 0) ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-[#D4AF37]'}`}
                >
                  <AnimatePresence mode="wait">
                    {isAdding ? (
                      <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                        <Check size={18} /> Added to Bag
                      </motion.div>
                    ) : (
                      <motion.div key="default" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                        <ShoppingBag size={18} /> Pre-Order
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <div className="mt-16 grid grid-cols-1 gap-6">
                <div className="flex items-center gap-6 p-6 border border-white/5 bg-white/[0.02]">
                  <ShieldCheck size={24} className="text-[#D4AF37]" strokeWidth={1.5} />
                  <div>
                    <h5 className="text-[10px] tracking-[0.2em] font-black uppercase text-white mb-1">Lifetime Warranty</h5>
                    <p className="text-[9px] text-white/40 uppercase">On all hardware and stitching.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 border border-white/5 bg-white/[0.02]">
                  <Truck size={24} className="text-[#D4AF37]" strokeWidth={1.5} />
                  <div>
                    <h5 className="text-[10px] tracking-[0.2em] font-black uppercase text-white mb-1">Priority Logistics</h5>
                    <p className="text-[9px] text-white/40 uppercase">Complimentary express shipping global.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
