
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Box, Heart, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';

const Account: React.FC = () => {
  const [userName, setUserName] = useState<string>('GUEST_OPERATIVE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch nickname
        const { data: nickData } = await supabase
          .from('nicknames')
          .select('nickname')
          .eq('user_id', session.user.id)
          .single();

        // Priority: Nickname, then full_name from metadata, then email, then fallback
        const name = nickData?.nickname || session.user.user_metadata?.full_name || session.user.email?.split('@')[0].toUpperCase();
        setUserName(name || 'GUEST_OPERATIVE');
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: nickData } = await supabase
          .from('nicknames')
          .select('nickname')
          .eq('user_id', session.user.id)
          .single();
        const name = nickData?.nickname || session.user.user_metadata?.full_name || session.user.email?.split('@')[0].toUpperCase();
        setUserName(name || 'GUEST_OPERATIVE');
      } else {
        setUserName('GUEST_OPERATIVE');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const menuItems = [
    { icon: User, label: 'Profile', path: '/account/profile' },
    { icon: Box, label: 'Orders', path: '/account/orders' },
    { icon: Heart, label: 'Wishlist', path: '/account/wishlist' },
    { icon: CreditCard, label: 'Vault Access', path: '/vault' }
  ];

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen pt-24 md:pt-40 pb-20 md:pb-32 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <motion.header 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 md:mb-24"
        >
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic mb-4 text-white break-all">
            {userName}
          </h1>
          <p className="text-[10px] tracking-[0.4em] font-bold text-[#D4AF37] uppercase">Member access: Level 01</p>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {menuItems.map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                to={item.path}
                className="p-12 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer transition-all flex flex-col items-center justify-center text-center group h-full block"
              >
                <item.icon size={32} strokeWidth={1} className="text-white/40 mb-8 group-hover:text-[#D4AF37] transition-colors" />
                <h3 className="text-[10px] tracking-[0.5em] font-black uppercase">{item.label}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Account;
