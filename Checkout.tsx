import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const [isPaid, setIsPaid] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setFormData(prev => ({ ...prev, email: session.user.email || '' }));
      }
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const createPayPalOrder = (data: any, actions: any) => {
  return actions.order.create({
    purchase_units: [
      {
        amount: { value: subtotal.toString() },
        description: "DSTRKT Order - " + items.map((i: any) => i.name).join(", ")
      }
    ],
    application_context: {
      landing_page: "BILLING",
      user_action: "PAY_NOW",
      return_url: `${window.location.origin}/thank-you`,
      cancel_url: `${window.location.origin}/checkout`
    }
  });
};

const onPayPalApprove = async (data: any, actions: any) => {
  if (actions.order) {
    const details = await actions.order.capture();
    const saved = await saveOrder(details.id, details.payer);
    if (saved) {
      setOrderId(details.id);
      setIsPaid(true);
      clearCart();
      window.location.replace(`${window.location.origin}/thank-you`);
    }
  }
};

const onPayPalCancel = () => {
  window.location.replace(`${window.location.origin}/checkout`);
};

const onPayPalError = (err: any) => {
  console.error(err);
  alert("Payment failed. Please try again.");
};
  const isFormValid = formData.email && formData.firstName && formData.lastName && formData.address;

  const saveOrder = async (orderId: string, payer: any) => {
    try {
      const { error } = await supabase.from('orders').insert({
        id: orderId,
        user_id: user?.id || null,
        user_email: formData.email,
        items: items,
        total_amount: subtotal,
        status: 'PROCESSED',
        shipping_address: formData,
        payer_name: `${payer.name.given_name} ${payer.name.surname}`
      });

      if (error) throw error;
      
      // Update stock
      for (const item of items) {
        const { data: prodData } = await supabase.from('products').select('stock').eq('id', item.id).single();
        if (prodData && prodData.stock !== undefined) {
           await supabase.from('products').update({ stock: Math.max(0, prodData.stock - item.quantity) }).eq('id', item.id);
        }
      }

      if (!user) {
        const guestOrders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
        guestOrders.push(orderId);
        localStorage.setItem('guest_orders', JSON.stringify(guestOrders));
      }
      
      return true;
    } catch (err: any) {
      console.error('Error saving order:', err);
      setSaveError(err.message);
      return false;
    }
  };

  if (isPaid) {
    return (
      <main className="bg-[#0a0a0a] min-h-screen pt-24 md:pt-40 pb-16 md:pb-32 px-6 md:px-12 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <CheckCircle2 size={80} className="text-[#D4AF37] animate-bounce" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">Order Secured.</h2>
          
          <div className="p-8 border border-white/10 bg-white/[0.02] space-y-4">
            <p className="text-[10px] tracking-[0.4em] font-black uppercase text-white/30">Your Order ID</p>
            <p className="text-2xl font-black uppercase tracking-tighter text-[#D4AF37] break-all">{orderId}</p>
            <p className="text-[8px] tracking-widest text-white/20 uppercase">Save this ID for tracking your manifest.</p>
          </div>

          <p className="text-white/40 text-sm tracking-widest uppercase leading-relaxed">
            Your transaction has been processed successfully. A confirmation email has been dispatched to {formData.email}.
          </p>
          <Link to="/account/orders">
            <button className="w-full bg-white text-black py-6 text-[11px] font-black tracking-[0.6em] uppercase hover:bg-[#D4AF37] transition-all mt-8">
              Track Order
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <PayPalScriptProvider options={{ 
      "client-id": (import.meta as any).env.VITE_PAYPAL_CLIENT_ID || "test",
      currency: "USD",
      intent: "capture",
      "disable-funding": "credit,paylater"
    }}>
      <main className="bg-[#0a0a0a] min-h-screen pt-24 md:pt-40 pb-16 md:pb-32 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <Link to="/" className="inline-flex items-center gap-4 text-[10px] tracking-[0.4em] font-black uppercase text-white/40 hover:text-white mb-8 md:mb-20 transition-colors">
            <ArrowLeft size={16} /> Return to Store
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-32">
            <div className="space-y-8 md:space-y-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter italic break-words leading-none">Securing Your Order.</h2>
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] tracking-[0.4em] font-black uppercase text-white/30">Contact Information</p>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="EMAIL ADDRESS" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 p-5 md:p-6 text-[11px] font-black tracking-widest uppercase focus:border-[#D4AF37] outline-none mb-4" 
                  />
                </div>
                
                <div className="space-y-4">
                  <p className="text-[10px] tracking-[0.4em] font-black uppercase text-white/30">Shipping Detail</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="firstName"
                      placeholder="FIRST NAME" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-white/5 border border-white/10 p-5 md:p-6 text-[11px] font-black tracking-widest uppercase outline-none focus:border-[#D4AF37]" 
                    />
                    <input 
                      type="text" 
                      name="lastName"
                      placeholder="LAST NAME" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-white/5 border border-white/10 p-5 md:p-6 text-[11px] font-black tracking-widest uppercase outline-none focus:border-[#D4AF37]" 
                    />
                  </div>
                  <input 
                    type="text" 
                    name="address"
                    placeholder="STREET ADDRESS" 
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 p-5 md:p-6 text-[11px] font-black tracking-widest uppercase outline-none focus:border-[#D4AF37]" 
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="city"
                      placeholder="CITY" 
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-white/5 border border-white/10 p-5 md:p-6 text-[11px] font-black tracking-widest uppercase outline-none focus:border-[#D4AF37]" 
                    />
                    <input 
                      type="text" 
                      name="zip"
                      placeholder="POSTAL CODE / ZIP" 
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="bg-white/5 border border-white/10 p-5 md:p-6 text-[11px] font-black tracking-widest uppercase outline-none focus:border-[#D4AF37]" 
                    />
                  </div>
                  
                  <input 
                    type="text" 
                    name="country"
                    placeholder="COUNTRY" 
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 p-5 md:p-6 text-[11px] font-black tracking-widest uppercase outline-none focus:border-[#D4AF37]" 
                  />
                </div>
                
                <div className={`transition-all duration-500 ${isFormValid ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                  <p className="text-[9px] tracking-[0.3em] font-bold text-white/20 uppercase mb-8 text-center">Authorized Payment District</p>
                  
                  <div className="space-y-4">
                    <PayPalButtons
                      fundingSource="paypal"
                      style={{ layout: "vertical", color: "white", shape: "rect", label: "pay" }}
                      createOrder={createPayPalOrder}
                      onApprove={onPayPalApprove}
                      onCancel={onPayPalCancel}
                      onError={onPayPalError}
                    />

                    <PayPalButtons 
                      fundingSource="card"
                      style={{ layout: "vertical", color: "black", shape: "rect" }}
                      createOrder={createPayPalOrder}
                      onApprove={onPayPalApprove}
                      onCancel={onPayPalCancel}
                      onError={onPayPalError}
                    />
                  </div>
                </div>

                {!isFormValid && (
                  <p className="text-[9px] tracking-[0.2em] font-bold text-[#D4AF37] uppercase text-center">
                    Please complete shipping details to enable payment
                  </p>
                )}
                {saveError && (
                  <div className="p-4 border border-red-500/20 bg-red-500/5 text-center">
                    <p className="text-[9px] tracking-[0.2em] font-bold text-red-500 uppercase">
                      Order Recorded with Error: {saveError}
                    </p>
                    <p className="text-[8px] text-white/40 uppercase mt-2">
                      Please contact support with your PayPal ID.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 h-fit">
              <h3 className="text-[10px] tracking-[0.5em] font-black uppercase mb-8 md:mb-12">Your Order Summary</h3>
              <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex-grow">
                      <p className="text-[11px] font-black uppercase tracking-wider line-clamp-1">{item.name}</p>
                      <p className="text-[9px] text-white/40 uppercase tracking-[0.3em]">QTY: {item.quantity}</p>
                    </div>
                    <p className="text-[11px] font-black whitespace-nowrap">{item.price}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-6 md:pt-8 space-y-4">
                <div className="flex justify-between text-[10px] tracking-[0.3em] font-bold text-white/40 uppercase">
                  <span>Shipping</span>
                  <span>COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-[10px] tracking-[0.5em] font-black uppercase">Total</span>
                  <span className="text-2xl md:text-3xl font-black">${subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PayPalScriptProvider>
  );
};

export default Checkout;
