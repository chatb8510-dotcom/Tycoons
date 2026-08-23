import { useState } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface CartPageProps {
  onNavigate: (page: Page) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    mobile_number: '',
    email: '',
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || items.length === 0) return;

    setSubmitting(true);
    submitEnquiry();
  }

  async function submitEnquiry() {
    try {
      const cartItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        qty: item.qty,
        quantity: item.quantity,
      }));

      const { error } = await supabase.from('cart_enquiries').insert({
        customer_name: formData.customer_name.trim(),
        mobile_number: formData.mobile_number.trim(),
        email: formData.email.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        message: formData.message.trim() || null,
        cart_items: cartItems,
        status: 'new',
      });

      if (error) throw error;

      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setErrors({ submit: 'Failed to submit enquiry. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center border-subtle">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h2 className="font-display text-2xl font-700 text-white mb-3">Enquiry Submitted!</h2>
          <p className="text-muted mb-6">
            Thank you for your interest. Our team will contact you shortly to discuss your requirements.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="w-full py-3 gold-gradient rounded-xl text-black font-medium"
          >
            Continue Shopping
          </button>
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
          <h1 className="font-display text-3xl sm:text-4xl font-800 text-white mb-2">
            Your Cart
          </h1>
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
                <div
                  key={item.id}
                  className="glass rounded-xl p-4 border-subtle flex gap-4"
                >
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
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
                        {item.qty && (
                          <p className="text-xs text-muted mt-1">{item.qty}</p>
                        )}
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
                <h2 className="font-display text-xl font-700 text-white mb-6">
                  Your Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#cccccc] mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_name: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, mobile_number: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#cccccc] mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
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
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-[#cccccc] mb-1.5">
                      Message / Requirement
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={3}
                      className="input-dark w-full px-4 py-3 rounded-lg text-sm resize-none"
                      placeholder="Tell us about your requirements..."
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
