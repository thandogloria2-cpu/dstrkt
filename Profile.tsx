
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, MapPin, Lock, Loader2, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';

const Profile: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Profile Data State
  const [profile, setProfile] = useState<any>({
    fullName: 'GUEST_OPERATIVE',
    nickname: '',
    email: '',
    memberSince: 'N/A',
    vault_access: false
  });
  const [nicknameInput, setNicknameInput] = useState('');
  const [savingNickname, setSavingNickname] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error && error.message.includes('refresh_token_not_found')) {
        supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(session);
        if (session) fetchProfile(session);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (currentSession: any) => {
    if (!currentSession?.user) return;
    
    try {
      // Try to get extended profile info from DB
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();

      // Get date from DB created_at or Auth user created_at
      const creationDate = data?.created_at || currentSession.user.created_at;
      const d = new Date(creationDate);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yy = String(d.getFullYear()).slice(-2);
      
      // Fetch nickname from nicknames table
      const { data: nickData } = await supabase
        .from('nicknames')
        .select('nickname')
        .eq('user_id', currentSession.user.id)
        .single();
      
      setProfile({
        // Priority: Database full_name, then metadata from registration, then email handle
        fullName: data?.full_name || currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0].toUpperCase() || 'ANONYMOUS_MEMBER',
        nickname: nickData?.nickname || '',
        email: currentSession.user.email,
        memberSince: `Member since ${mm}/${yy}`,
        vault_access: data?.vault_access || false
      });
      if (nickData?.nickname) {
        setNicknameInput(nickData.nickname);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Fallback for immediate UI update after registration
      const d = new Date(currentSession.user.created_at);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yy = String(d.getFullYear()).slice(-2);
      
      setProfile({
        fullName: currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0].toUpperCase(),
        nickname: '',
        email: currentSession.user.email,
        memberSince: `Member since ${mm}/${yy}`,
        vault_access: false
      });
    }
  };

  const handleSaveNickname = async () => {
    if (!session?.user || !nicknameInput.trim()) return;
    
    setSaveStatus('saving');
    try {
      const { error } = await supabase
        .from('nicknames')
        .upsert({ 
          user_id: session.user.id, 
          nickname: nicknameInput.trim(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        if (error.code === '42P01') {
          setAuthError("DATABASE ERROR: 'nicknames' table not found. Please run the SQL setup in Supabase.");
        } else {
          setAuthError(error.message);
        }
        throw error;
      }
      
      setProfile(prev => ({ ...prev, nickname: nicknameInput.trim() }));
      setSaveStatus('success');
      setAuthError(null);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Error saving nickname:', err);
      setSaveStatus('error');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authMode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: displayName }
          }
        });
        if (error) throw error;
        setAuthError("Registration successful. Check your email for verification.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://dstrkt.co.za'
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError("Please enter your email address first.");
      return;
    }
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/profile',
      });
      if (error) throw error;
      setResetSent(true);
      setAuthError("Password reset link sent to your email.");
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile({
      fullName: 'GUEST_OPERATIVE',
      nickname: '',
      email: '',
      memberSince: 'N/A',
      vault_access: false
    });
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
      </div>
    );
  }

  // Auth Portal View
  if (!session) {
    return (
      <main className="bg-black min-h-screen pt-24 md:pt-40 pb-32 px-6 md:px-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37] rounded-full blur-[200px]" />
        </div>

        <div className="max-w-[500px] w-full relative z-10">
          <Link to="/account" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-12 transition-colors">
            <ArrowLeft size={16} /> Back to Account
          </Link>
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-black uppercase mb-4">Membership Access</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white mb-6">Operative.</h1>
            <div className="flex justify-center gap-8 mb-12">
              <button 
                onClick={() => setAuthMode('login')}
                className={`text-[10px] tracking-[0.4em] font-black uppercase transition-all pb-2 border-b-2 ${authMode === 'login' ? 'text-white border-[#D4AF37]' : 'text-white/20 border-transparent hover:text-white/60'}`}
              >
                Identify
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className={`text-[10px] tracking-[0.4em] font-black uppercase transition-all pb-2 border-b-2 ${authMode === 'register' ? 'text-white border-[#D4AF37]' : 'text-white/20 border-transparent hover:text-white/60'}`}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <AnimatePresence mode="wait">
              {authMode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <input 
                    type="text" 
                    placeholder="FULL NAME / CALLSIGN"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 p-5 text-[11px] font-black tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/10"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input 
              type="email" 
              placeholder="EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 p-5 text-[11px] font-black tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/10"
            />
            
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 p-5 text-[11px] font-black tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/10 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {authMode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[9px] tracking-[0.2em] font-black uppercase text-white/40 hover:text-[#D4AF37] transition-colors"
                >
                  Forgotten Password?
                </button>
              </div>
            )}

            {authError && (
              <p className={`text-[10px] tracking-widest uppercase font-bold text-center ${authError.includes('successful') || authError.includes('sent') ? 'text-green-500' : 'text-red-500'}`}>
                {authError}
              </p>
            )}

            <div className="space-y-4">
              <button 
                type="submit"
                disabled={authLoading}
                className="w-full bg-white text-black py-6 text-[11px] tracking-[0.6em] font-black uppercase hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-4 group"
              >
                {authLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    {authMode === 'login' ? 'Authorize Session' : 'Create Operative Profile'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              { (authMode === 'login' || authMode === 'register') && (
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white/5 border border-white/10 text-white py-6 text-[11px] tracking-[0.6em] font-black uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {authMode === 'login' ? 'Login with Google' : 'Sign up with Google'}
                </button>
              )}
            </div>
          </form>

          <p className="mt-12 text-[9px] text-white/20 text-center uppercase tracking-[0.3em] leading-loose">
            By accessing the District, you agree to our<br />terms of engagement and privacy protocols.
          </p>
        </div>
      </main>
    );
  }

  // Dashboard View (Logged In)
  return (
    <main className="bg-black min-h-screen pt-24 md:pt-40 pb-20 md:pb-32 px-6 md:px-12 selection:bg-[#D4AF37] selection:text-black">
      <div className="max-w-[1000px] mx-auto">
        <Link to="/account" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-12 md:mb-20 transition-colors">
          <ArrowLeft size={16} /> Back to Account
        </Link>

        <header className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-black uppercase">Verified Operative</p>
              {profile.vault_access && (
                <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 text-[8px] font-black uppercase tracking-widest border border-[#D4AF37]/20 flex items-center gap-2">
                  <ShieldCheck size={10} /> Vault Access: L4
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-white leading-none break-all">
              {profile.nickname || profile.fullName}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase border border-red-500/20 text-red-500/60 px-6 md:px-8 py-3 md:py-4 hover:bg-red-500 hover:text-white transition-all"
            >
              LOG OUT <Lock size={14} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 border border-white/5 bg-white/[0.01] space-y-12"
          >
            <h3 className="text-[10px] tracking-[0.5em] font-black uppercase text-white/40 border-b border-white/5 pb-4">Operative Identity</h3>
            <div className="space-y-8">
              <div className="group">
                <p className="text-[9px] tracking-[0.2em] font-bold text-white/30 uppercase mb-2">Vault Nickname</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    placeholder="ENTER NICKNAME"
                    className="flex-grow bg-white/5 border border-white/10 p-3 text-[11px] font-black tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/10"
                  />
                  <button 
                    onClick={handleSaveNickname}
                    disabled={saveStatus === 'saving'}
                    className={`bg-white text-black px-6 py-3 text-[10px] tracking-[0.2em] font-black uppercase transition-all disabled:opacity-50 ${saveStatus === 'error' ? 'bg-red-500 text-white' : 'hover:bg-[#D4AF37]'}`}
                  >
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved' : saveStatus === 'error' ? 'Retry' : 'Update'}
                  </button>
                </div>
              </div>
              <div className="group">
                <p className="text-[9px] tracking-[0.2em] font-bold text-white/30 uppercase mb-2">Operative Name</p>
                <p className="text-xl font-black uppercase tracking-tight text-white group-hover:text-[#D4AF37] transition-colors break-all">{profile.nickname || profile.fullName}</p>
              </div>
              <div className="group">
                <p className="text-[9px] tracking-[0.2em] font-bold text-white/30 uppercase mb-2">Registered Name</p>
                <p className="text-xl font-black uppercase tracking-tight text-white/40 group-hover:text-[#D4AF37] transition-colors break-all">{profile.fullName}</p>
              </div>
              <div className="group">
                <p className="text-[9px] tracking-[0.2em] font-bold text-white/30 uppercase mb-2">Email Hash</p>
                <p className="text-xl font-black uppercase tracking-tight text-white group-hover:text-[#D4AF37] transition-colors break-all">{profile.email}</p>
              </div>
              <div className="group">
                <p className="text-[9px] tracking-[0.2em] font-bold text-white/30 uppercase mb-2">Service Period</p>
                <p className="text-xl font-black uppercase tracking-tight text-white/40 italic">{profile.memberSince}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-10 border border-white/5 bg-white/[0.01] space-y-12"
          >
            <h3 className="text-[10px] tracking-[0.5em] font-black uppercase text-white/40 border-b border-white/5 pb-4">Encryption & Comms</h3>
            <div className="space-y-8">
              <div className="flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <Bell size={18} className="text-[#D4AF37]" />
                  <p className="text-sm font-black uppercase tracking-widest text-white group-hover:text-[#D4AF37] transition-colors">Drop Intelligence</p>
                </div>
                <div className="w-10 h-5 bg-[#D4AF37] rounded-full relative">
                  <div className="absolute top-1 right-1 w-3 h-3 bg-black rounded-full" />
                </div>
              </div>
              
              <div className="flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <MapPin size={18} className="text-[#D4AF37]" />
                  <p className="text-sm font-black uppercase tracking-widest text-white group-hover:text-[#D4AF37] transition-colors">Global Logistics</p>
                </div>
                <span className="text-[10px] font-black text-white/40 uppercase">Encrypted</span>
              </div>

              <div className="pt-8 border-t border-white/5">
                <p className="text-[9px] text-white/20 uppercase tracking-widest leading-loose">
                  Account security managed by DSTRKT Global. Data is end-to-end encrypted.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
