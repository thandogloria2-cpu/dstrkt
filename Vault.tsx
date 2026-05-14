
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VAULT_DROPS, filterProducts } from './constants';
import { Lock, Clock, Info, Loader2, ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';
import { VaultDrop } from './types';

const VaultItem: React.FC<{ drop: VaultDrop, index: number, hasAccess: boolean }> = ({ drop, index, hasAccess }) => {
  const status = drop.status || 'active';
  const isUpcoming = status === 'upcoming';
  const isSoldOut = status === 'sold-out';
  const isActive = status === 'active';

  const ButtonContent = () => (
    <button className={`w-full py-5 text-[10px] tracking-[0.4em] font-black uppercase transition-all duration-500 border border-white/10 hover:border-[#D4AF37] ${isUpcoming ? 'bg-transparent text-white' : 'bg-[#D4AF37] text-black'} ${(!hasAccess && !isSoldOut && !isUpcoming) ? 'opacity-50' : ''}`}>
      {isUpcoming ? 'Join Waiting List' : isSoldOut ? 'Archived' : hasAccess ? 'Enter Private Shop' : 'Access Restricted'}
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[4/5] bg-[#0d0d0d] overflow-hidden mb-8 border border-white/5 gold-glow transition-all duration-500">
        <img 
          src={drop.image || 'https://via.placeholder.com/800x1000?text=DSTRKT+VAULT'} 
          alt={drop.name} 
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110 ${isSoldOut ? 'grayscale opacity-30' : 'grayscale group-hover:grayscale-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
        
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] tracking-[0.8em] font-black text-white/40 uppercase rotate-[-45deg] border-2 border-white/10 px-8 py-2">Sold Out</span>
          </div>
        )}

        {!hasAccess && !isUpcoming && !isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
            <div className="text-center p-6">
              <ShieldAlert className="text-[#D4AF37] mx-auto mb-4" size={32} />
              <p className="text-[10px] tracking-[0.4em] font-black text-white uppercase">Access Restricted</p>
              <p className="text-[8px] tracking-widest text-white/40 uppercase mt-2 italic">Identify required</p>
            </div>
          </div>
        )}

        <div className="absolute top-8 right-8">
          {isUpcoming ? (
            <div className="flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-full text-[9px] font-black tracking-widest">
              <Clock size={12} /> DROPS SOON
            </div>
          ) : !isSoldOut && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black tracking-widest ${hasAccess ? 'bg-green-500 text-black' : 'bg-white text-black'}`}>
              {hasAccess ? <CheckCircle2 size={12} /> : <Lock size={12} />} {hasAccess ? 'GRANTED' : 'LOCKED'}
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <p className="text-[10px] tracking-[0.4em] font-bold text-[#D4AF37] mb-2 uppercase">
            {(drop.status || 'ACTIVE').replace('-', ' ')}
          </p>
          <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">{drop.name || 'Unnamed Drop'}</h4>
          <p className="text-[11px] text-white/60 leading-relaxed font-light line-clamp-2">{drop.description}</p>
        </div>
      </div>
      
      {isActive && hasAccess ? (
        <Link to={`/product/${drop.id}`} className="block w-full">
          <ButtonContent />
        </Link>
      ) : (
        <div className="block w-full cursor-not-allowed">
          <ButtonContent />
        </div>
      )}
    </motion.div>
  );
};

const Vault: React.FC = () => {
  const [drops, setDrops] = useState<VaultDrop[]>([]);
  const [hasVaultAccess, setHasVaultAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // 1. Initial Auth Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setHasVaultAccess(true);
        // Initialize profile with metadata immediately
        setProfile({
          full_name: currentUser.user_metadata?.full_name,
          nickname: null
        });
        fetchUserSpecificProfile(currentUser.id);
      }
    });

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setHasVaultAccess(true);
        setProfile({
          full_name: currentUser.user_metadata?.full_name,
          nickname: null
        });
        fetchUserSpecificProfile(currentUser.id);
      } else {
        setHasVaultAccess(false);
      }
    });

    fetchVaultDrops();

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserSpecificProfile = async (userId: string) => {
    try {
      // Fetch profile data and nickname in parallel
      const [profileRes, nickRes] = await Promise.all([
        supabase.from('profiles').select('vault_access, full_name').eq('id', userId).single(),
        supabase.from('nicknames').select('nickname').eq('user_id', userId).single()
      ]);
      
      const profileData = profileRes.data;
      const nickData = nickRes.data;
      
      setProfile((prev: any) => ({
        ...prev,
        full_name: profileData?.full_name || prev?.full_name,
        nickname: nickData?.nickname || null
      }));

      if (profileData) {
        setHasVaultAccess(profileData.vault_access ?? true);
      }
    } catch (err) {
      console.error('Profile fetch failed:', err);
    }
  };

  const fetchVaultDrops = async () => {
    try {
      const { data, error } = await supabase
        .from('vault_drops')
        .select('*')
        .order('release_date', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(d => ({
          id: d.id,
          name: d.name,
          releaseDate: d.release_date,
          image: d.image_url,
          status: d.status || 'active',
          description: d.description
        }));
        setDrops(filterProducts(mapped));
      } else {
        setDrops(filterProducts(VAULT_DROPS));
      }
    } catch (err) {
      setDrops(filterProducts(VAULT_DROPS));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black min-h-screen pt-24 md:pt-40 pb-20 md:pb-40 selection:bg-[#D4AF37] selection:text-black">
      <section className="max-w-[1800px] mx-auto px-6 md:px-12">
        <Link to="/" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <header className="mb-12 md:mb-24 max-w-4xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-[#D4AF37] text-xs tracking-[0.4em] md:tracking-[0.8em] font-bold mb-6 md:mb-8 uppercase flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[#D4AF37]"></span> 
              {user ? 'Priority Access Enabled' : 'Members Exclusive'}
            </p>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-[-0.05em] uppercase mb-8 md:mb-12 leading-none break-words">
              The<br />Vault.
            </h1>
            <p className="text-white/40 text-base md:text-xl leading-relaxed font-light italic max-w-2xl break-words">
              {user 
                ? `Welcome back, Operative ${profile?.nickname || profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0].toUpperCase()}. Your clearance level has been verified. The archive is now unlocked.` 
                : "The Vault is where rare drops live. Limited releases, curated pieces, and members-only access — unlocked for verified operatives."}
            </p>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {drops.map((drop, idx) => (
              <VaultItem key={drop.id} drop={drop} index={idx} hasAccess={hasVaultAccess} />
            ))}
          </div>
        )}

        {!user && (
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-20 md:mt-40 p-8 md:p-24 border border-white/5 bg-[#050505] flex flex-col md:flex-row gap-12 items-center justify-between"
          >
            <div className="max-w-xl">
              <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter">Become a District Member.</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                Gain first access to capsule collections, collaborative drops, and secret events. Members are notified 24 hours before any public release.
              </p>
              <div className="flex gap-4 text-[10px] tracking-widest text-white/40 uppercase">
                <Info size={16} className="text-[#D4AF37] shrink-0" />
                <p>Registration required for active drops.</p>
              </div>
            </div>
            <Link to="/account/profile">
              <button className="bg-white text-black px-12 py-6 text-[12px] tracking-[0.4em] font-black uppercase hover:bg-[#D4AF37] transition-colors">
                Register for access
              </button>
            </Link>
          </motion.div>
        )}
      </section>
    </main>
  );
};

export default Vault;
