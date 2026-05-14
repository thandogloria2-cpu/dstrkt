import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Package, ExternalLink, X, CheckCircle2, Circle, Truck, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';

interface TrackingEvent {
  status: string;
  location: string;
  date: string;
  isCompleted: boolean;
  isCurrent?: boolean;
}

interface Order {
  id: string;
  date: string;
  status: 'PROCESSED' | 'SHIPPED' | 'IN TRANSIT' | 'DELIVERED';
  total: string;
  item: string;
  trackingHistory: TrackingEvent[];
}

const TrackingModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-10"
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-[#0d0d0d] border border-white/10 flex flex-col max-h-full overflow-hidden"
      >
        {/* Fixed Header with Close Button */}
        <div className="flex justify-between items-start p-8 md:p-12 pb-4 md:pb-6 relative z-10">
          <header className="pr-16">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] font-black uppercase mb-4">Tracking Details</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-2 break-all">{order.id}</h2>
            <div className="flex items-center gap-4 text-[10px] tracking-widest text-white/40 uppercase font-bold">
              <Package size={14} className="text-[#D4AF37]" /> {order.item}
            </div>
          </header>
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors bg-black/50 p-2 md:p-0 rounded-full"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto px-8 md:px-12 py-4 md:py-6 custom-scrollbar">
          <div className="space-y-0 relative">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
            
            {order.trackingHistory.map((event, idx) => (
              <div key={idx} className="relative pl-12 pb-10 last:pb-0 group">
                {/* Status Indicator */}
                <div className={`absolute left-0 top-1 w-6 h-6 flex items-center justify-center bg-[#0d0d0d] z-10 ${event.isCurrent ? 'text-[#D4AF37]' : 'text-white/20'}`}>
                  {event.isCurrent ? <CheckCircle2 size={24} strokeWidth={1.5} /> : <Circle size={10} fill="currentColor" />}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className={`text-sm font-black uppercase tracking-widest ${event.isCurrent ? 'text-white' : 'text-white/40'}`}>
                      {event.status}
                    </h4>
                    {event.isCurrent && (
                      <span className="text-[8px] bg-[#D4AF37] text-black px-2 py-0.5 font-black uppercase tracking-tighter">Current</span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/60 flex items-center gap-2 uppercase tracking-tight">
                    <MapPin size={10} className="text-[#D4AF37]" /> {event.location}
                  </p>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-8 md:p-12 pt-6 border-t border-white/5 bg-[#0d0d0d] relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-white/40">
              <Truck size={20} className="text-[#D4AF37]" strokeWidth={1.5} />
              <p className="text-[10px] tracking-widest uppercase font-bold">Est. Delivery: Priority Express</p>
            </div>
            <button className="text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-[#D4AF37] transition-colors">
              Support Concierge
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Orders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [searchId, setSearchId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      const guestOrders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      if (currentSession && guestOrders.length > 0) {
        // Fetch both user orders and guest orders from this browser
        query = query.or(`user_id.eq.${currentSession.user.id},id.in.(${guestOrders.map((id: string) => `"${id}"`).join(',')})`);
      } else if (currentSession) {
        query = query.eq('user_id', currentSession.user.id);
      } else if (guestOrders.length > 0) {
        query = query.in('id', guestOrders);
      } else {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      if (data) {
        setOrders(data.map(formatOrder));
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim() || !searchEmail.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error: searchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', searchId.trim())
        .eq('user_email', searchEmail.trim().toLowerCase())
        .single();

      if (searchError) throw new Error('Order not found or access denied. Verify ID and Email.');
      
      if (data) {
        const formatted = formatOrder(data);
        // Add to local list if not already there
        setOrders(prev => {
          if (prev.find(o => o.id === formatted.id)) return prev;
          return [formatted, ...prev];
        });
        setSelectedOrder(formatted);
        
        // Save to guest orders so it persists
        const guestOrders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
        if (!guestOrders.includes(data.id)) {
          guestOrders.push(data.id);
          localStorage.setItem('guest_orders', JSON.stringify(guestOrders));
        }
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const formatOrder = (o: any): Order => ({
    id: o.id,
    date: new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
    status: o.status,
    total: `$${o.total_amount.toLocaleString()}`,
    item: o.items[0]?.name || 'DSTRKT ITEM',
    trackingHistory: [
      { status: 'Processed', location: 'District Logistics Center', date: new Date(o.created_at).toLocaleString(), isCompleted: true, isCurrent: true },
      { status: 'Order Placed', location: 'DSTRKT Online', date: new Date(o.created_at).toLocaleString(), isCompleted: true },
    ]
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading && orders.length === 0) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen pt-24 md:pt-40 pb-20 md:pb-32 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 md:mb-20">
          <Link to="/account" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Account
          </Link>
          
          <form onSubmit={handleManualSearch} className="flex flex-col md:flex-row w-full md:w-auto gap-2">
            <input 
              type="text" 
              placeholder="ORDER ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-black tracking-widest uppercase outline-none focus:border-[#D4AF37] w-full md:w-48"
            />
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-black tracking-widest uppercase outline-none focus:border-[#D4AF37] w-full md:w-64"
            />
            <button 
              disabled={isSearching}
              className="bg-white text-black px-6 py-3 text-[10px] font-black tracking-widest uppercase hover:bg-[#D4AF37] transition-all disabled:opacity-50"
            >
              {isSearching ? '...' : 'Search'}
            </button>
          </form>
        </div>

        <header className="mb-16 md:mb-24">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.8em] font-black uppercase mb-6 md:mb-8">Purchase History</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic text-white">Manifest.</h1>
        </header>

        <div className="space-y-8">
          {error ? (
            <div className="py-40 text-center border border-red-500/20 border-dashed">
              <p className="text-[10px] tracking-[0.5em] font-bold text-red-500 uppercase italic mb-4">Database Sync Error.</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest">{error}</p>
              <button onClick={fetchOrders} className="mt-8 text-[10px] tracking-widest font-black uppercase text-[#D4AF37] hover:underline">Retry Connection</button>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order, i) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group border border-white/5 bg-white/[0.01] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:bg-white/[0.03] transition-all"
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#D4AF37]">
                    <Package size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{order.id}</h3>
                    <p className="text-[10px] tracking-[0.3em] font-bold text-white/40 uppercase">{order.item} — {order.date}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-12 w-full md:w-auto">
                  <div className="space-y-1">
                    <p className="text-[9px] tracking-[0.2em] font-bold text-white/30 uppercase">Status</p>
                    <p className={`text-[10px] font-black tracking-widest uppercase ${order.status === 'IN TRANSIT' || order.status === 'PROCESSED' ? 'text-[#D4AF37]' : 'text-white'}`}>{order.status}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] tracking-[0.2em] font-bold text-white/30 uppercase">Total</p>
                    <p className="text-xl font-black">{order.total}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-3 text-[10px] tracking-[0.4em] font-black uppercase text-white hover:text-[#D4AF37] transition-colors ml-auto md:ml-0 group/btn"
                  >
                    Track <ExternalLink size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-40 text-center border border-white/5 border-dashed">
              <p className="text-[10px] tracking-[0.5em] font-bold text-white/20 uppercase italic mb-4">No orders recorded in the district.</p>
              <p className="text-[8px] tracking-widest text-white/10 uppercase">Try searching by Order ID above if you purchased as a guest.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedOrder && (
          <TrackingModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Orders;