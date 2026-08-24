import { useState } from 'react';
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Send,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  FileText,
  Hash,
  Calendar,
  Package,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface CartPageProps {
  onNavigate: (page: Page) => void;
}

interface SubmittedOrder {
  id: string;
  customer_name: string;
  mobile_number: string;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  message: string | null;
  cart_items: CartItemRecord[];
  status: string;
  created_at: string;
}

interface CartItemRecord {
  id: string;
  name: string;
  category: string;
  qty: string;
  quantity: number;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Pending',
  contacted: 'Contacted',
  resolved: 'Completed',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-[rgba(232,184,109,0.15)] text-[#E8B86D] border border-[rgba(232,184,109,0.2)]',
  contacted: 'bg-[rgba(59,130,246,0.15)] text-blue-400 border border-blue-400/20',
  resolved: 'bg-[rgba(34,197,94,0.15)] text-emerald-400 border border-emerald-400/20',
};

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    mobile_number: '',
    email: '',
    address: '',
    city: '',
    state: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Name is required';
    if (!formData.mobile_number.trim()) newErrors.mobile_number = 'Mobile number is required';
    else if (!/^[0-9]{10}$/.test(formData.mobile_number.trim()))
      newErrors.mobile_number = 'Enter a valid 10-digit mobile number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || items.length === 0) return;

    setSubmitting(true);

    try {
      const cartItems: CartItemRecord[] = items.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        qty: item.qty,
        quantity: item.quantity,
      }));

      const { data, error } = await supabase
        .from('cart_enquiries')
        .insert({
          customer_name: formData.customer_name.trim(),
          mobile_number: formData.mobile_number.trim(),
          email: formData.email.trim() || null,
          address: formData.address.trim() || null,
          city: formData.city.trim() || null,
          state: formData.state.trim() || null,
          message: formData.message.trim() || null,
          cart_items: cartItems,
          status: 'new',
        })
        .select()
        .single();

      if (error) throw error;

      setSubmittedOrder(data as SubmittedOrder);
      clearCart();
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setErrors({ submit: 'Failed to submit enquiry. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedOrder) {
    const totalQuantity = submittedOrder.cart_items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808] pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-800 text-white mb-3">
              Order Submitted Successfully!
            </h1>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Thank you for your enquiry. Our team will contact you shortly to confirm your order.
            </p>
          </div>

          {/* Enquiry ID & Status Banner */}
          <div className="glass rounded-2xl p-5 mb-6 border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up animate-delay-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8B86D]/10 flex items-center justify-center">
                <Hash size={18} className="text-[#E8B86D]" />
              </div>
              <div>
                <div className="text-xs text-muted uppercase tracking-wider">Enquiry ID</div>
                <div className="font-mono text-sm text-white">
                  {submittedOrder.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8B86D]/10 flex items-center justify-center">
                <Calendar size={18} className="text-[#E8B86D]" />
              </div>
              <div>
                <div className="text-xs text-muted uppercase tracking-wider">Submitted</div>
                <div className="text-sm text-white">
                  {new Date(submittedOrder.created_at).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${STATUS_COLORS[submittedOrder.status]}`}
            >
              {STATUS_LABELS[submittedOrder.status] || submittedOrder.status}
            </span>
          </div>

          {/* Customer Details */}
          <div className="glass rounded-2xl p-6 mb-6 border-subtle animate-fade-in-up animate-delay-200">
            <h2 className="font-display text-xl font-700 text-white mb-5 flex items-center gap-2">
              <Package size={18} className="text-[#E8B86D]" />
              Your Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <DetailRow icon={<FileText size={14} />} label="Name" value={submittedOrder.customer_name} />
              <DetailRow icon={<Phone size={14} />} label="Phone" value={submittedOrder.mobile_number} />
              <DetailRow
                icon={<Mail size={14} />}
                label="Email"
                value={submittedOrder.email || '—'}
              />
              <DetailRow
                icon={<MapPin size={14} />}
                label="Address"
                value={[
                  submittedOrder.address,
                  submittedOrder.city,
                  submittedOrder.state,
                ]
                  .filter(Boolean)
                  .join(', ') || '—'}
              />
            </div>
            {submittedOrder.message && (
              <div className="mt-4 pt-4 border-t border-subtle">
                <div className="text-xs text-muted uppercase tracking-wider mb-1">Notes</div>
                <p className="text-sm text-white leading-relaxed">{submittedOrder.message}</p>
              </div>
            )}
          </div>

          {/* Ordered Products */}
          <div className="glass rounded-2xl p-6 mb-6 border-subtle animate-fade-in-up animate-delay-300">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-700 text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#E8B86D]" />
                Ordered Products
              </h2>
              <span className="text-sm text-muted">
                {submittedOrder.cart_items.length} item{submittedOrder.cart_items.length === 1 ? '' : 's'} · {totalQuantity} unit{totalQuantity === 1 ? '' : 's'}
              </span>
            </div>

            <div className="space-y-3">
              {submittedOrder.cart_items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-subtle"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#E8B86D]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#E8B86D]">{index + 1}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-700 text-white text-sm leading-tight truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold text-[#E8B86D] uppercase tracking-wider">
                          {item.category}
                        </span>
                        {item.qty && (
                          <span className="text-xs text-muted">· {item.qty}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-muted">Qty</div>
                      <div className="font-display font-700 text-white text-lg">
                        {item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animate-delay-400">
            <button
              onClick={() => onNavigate('products')}
              className="flex-1 py-3.5 gold-gradient rounded-xl text-black font-medium flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              Continue Shopping
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 py-3.5 glass rounded-xl text-white font-medium flex items-center justify-center gap-2 border-subtle hover:border-white/20 transition-all"
            >
              Back to Home
            </button>
          </div>

          <p className="text-xs text-muted text-center mt-6">
            Please save your Enquiry ID for future reference. No online payment is required — this is an enquiry only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808] pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-[#E8B86D] mb-4 border-subtle">
            <ShoppingBag size={14} />
            Enquiry Cart
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-800 text-white mb-2">Your Cart</h1>
          <p className="text-muted">
            {totalItems === 0
              ? 'Your cart is empty'
              : `${totalItems} item${totalItems === 1 ? '' : 's'} ready for enquiry`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center border-subtle">
            <ShoppingBag size={48} className="text-muted mx-auto mb-4" />
            <p className="text-muted text-lg mb-6">Your cart is empty</p>
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 gold-gradient rounded-xl text-black font-medium"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-3 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="glass rounded-xl p-4 border-subtle flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-semibold text-[#E8B86D] uppercase tracking-wider mb-1">
                          {item.category}
                        </div>
                        <h3 className="font-display font-700 text-white text-sm leading-tight truncate">
                          {item.name}
                        </h3>
                        {item.qty && <p className="text-xs text-muted mt-1">{item.qty}</p>}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted hover:text-white transition-colors border-subtle"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-white font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-muted hover:text-white transition-colors border-subtle"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-sm text-muted hover:text-red-400 transition-colors"
              >
                Clear all items
              </button>
            </div>

            {/* Customer Form */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 border-subtle sticky top-24">
                <h2 className="font-display text-xl font-700 text-white mb-6">Your Details</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#cccccc] mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                      placeholder="Your name"
                    />
                    {errors.customer_name && (
                      <p className="text-red-400 text-xs mt-1">{errors.customer_name}</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-[#cccccc] mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                    {errors.mobile_number && (
                      <p className="text-red-400 text-xs mt-1">{errors.mobile_number}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#cccccc] mb-1.5">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-[#cccccc] mb-1.5">
                      Full Address *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                      className="input-dark w-full px-4 py-3 rounded-lg text-sm resize-none"
                      placeholder="Street, Area, Landmark..."
                    />
                    {errors.address && (
                      <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#cccccc] mb-1.5">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#cccccc] mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-[#cccccc] mb-1.5">
                      Notes (optional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className="input-dark w-full px-4 py-3 rounded-lg text-sm resize-none"
                      placeholder="Any specific requirements or questions..."
                    />
                  </div>

                  {errors.submit && (
                    <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-3">
                      <p className="text-red-300 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || items.length === 0}
                    className="w-full py-3.5 gold-gradient rounded-xl text-black font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size={16} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Enquiry
                      </>
                    )}
                  </button>

                  <p className="text-xs text-muted text-center">
                    No online payment required. This is an enquiry only.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-muted">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-sm text-white break-words">{value}</div>
      </div>
    </div>
  );
}
