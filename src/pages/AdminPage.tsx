import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Package,
  RefreshCw,
  LogIn,
  LogOut,
  Eye,
  CreditCard as Edit3,
  ShoppingBag,
  Image as ImageIcon,
  Trash2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  Hash,
  ShoppingCart,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Enquiry, EnquiryStatus, Page } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface AdminPageProps {
  onNavigate: (page: Page) => void;
}

const STATUS_COLORS: Record<EnquiryStatus, string> = {
  new: 'bg-[rgba(232,184,109,0.15)] text-[#E8B86D] border border-[rgba(232,184,109,0.2)]',
  contacted: 'bg-[rgba(59,130,246,0.15)] text-blue-400 border border-blue-400/20',
  resolved: 'bg-[rgba(34,197,94,0.15)] text-emerald-400 border border-emerald-400/20',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Pending',
  contacted: 'Contacted',
  resolved: 'Completed',
};

interface CartEnquiry {
  id: string;
  customer_name: string;
  mobile_number: string;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  message: string | null;
  cart_items: CartItemRecord[];
  status: EnquiryStatus;
  created_at: string;
}

interface CartItemRecord {
  id: string;
  name: string;
  category: string;
  qty: string;
  quantity: number;
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const [session, setSession] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'business' | 'product'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Tab state: regular enquiries vs cart enquiries
  const [activeTab, setActiveTab] = useState<'enquiries' | 'cart'>('enquiries');

  // Cart enquiries state
  const [cartEnquiries, setCartEnquiries] = useState<CartEnquiry[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [selectedCartEnquiry, setSelectedCartEnquiry] = useState<CartEnquiry | null>(null);
  const [deletingCartId, setDeletingCartId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(!!s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    setEnquiries((data as Enquiry[]) || []);
    setLoading(false);
  }, []);

  const fetchCartEnquiries = useCallback(async () => {
    setCartLoading(true);
    const { data } = await supabase
      .from('cart_enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    setCartEnquiries((data as CartEnquiry[]) || []);
    setCartLoading(false);
  }, []);

  useEffect(() => {
    if (session) {
      fetchEnquiries();
      fetchCartEnquiries();
    }
  }, [session, fetchEnquiries, fetchCartEnquiries]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      if (!email || !password) {
        setLoginError('Please enter email and password');
        setLoginLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.status === 400) {
          setLoginError('Invalid email or password');
        } else if (error.status === 422) {
          setLoginError('Please check your email and password');
        } else {
          setLoginError(error.message || 'Login failed. Please try again.');
        }
        console.error('Login error:', error);
      }
    } catch (err) {
      console.error('Login exception:', err);
      setLoginError('An error occurred during login. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setEnquiries([]);
    setCartEnquiries([]);
  }

  async function updateStatus(id: string, status: EnquiryStatus) {
    await supabase.from('enquiries').update({ status }).eq('id', id);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status } : null));
    }
  }

  async function updateCartStatus(id: string, status: EnquiryStatus) {
    await supabase.from('cart_enquiries').update({ status }).eq('id', id);
    setCartEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    if (selectedCartEnquiry?.id === id) {
      setSelectedCartEnquiry((prev) => (prev ? { ...prev, status } : null));
    }
  }

  async function deleteCartEnquiry(id: string) {
    if (!confirm('Are you sure you want to delete this cart enquiry? This cannot be undone.')) return;

    setDeletingCartId(id);
    try {
      const { error } = await supabase.from('cart_enquiries').delete().eq('id', id);
      if (error) throw error;

      setCartEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedCartEnquiry?.id === id) {
        setSelectedCartEnquiry(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete enquiry. Please try again.');
    } finally {
      setDeletingCartId(null);
    }
  }

  const filtered = enquiries.filter((e) => filter === 'all' || e.type === filter);
  const totalBusiness = enquiries.filter((e) => e.type === 'business').length;
  const totalProduct = enquiries.filter((e) => e.type === 'product').length;
  const totalNew = enquiries.filter((e) => e.status === 'new').length;

  // Cart stats
  const cartTotal = cartEnquiries.length;
  const cartNew = cartEnquiries.filter((e) => e.status === 'new').length;
  const cartContacted = cartEnquiries.filter((e) => e.status === 'contacted').length;
  const cartCompleted = cartEnquiries.filter((e) => e.status === 'resolved').length;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-sm">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <div className="glass rounded-2xl p-8">
            <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center mb-6">
              <LogIn size={20} className="text-black" />
            </div>
            <h1 className="font-display text-2xl font-700 text-white mb-1">Admin Access</h1>
            <p className="text-muted text-sm mb-8">Sign in to manage enquiries and content</p>

            <form onSubmit={handleLogin} className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#cccccc]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#cccccc]">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                  autoComplete="current-password"
                />
              </div>
              {loginError && (
                <div className="bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3">
                  <p className="text-red-300 text-xs">{loginError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="btn-gold w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loginLoading ? (
                  <>
                    <LoadingSpinner size={16} />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="bg-[rgba(232,184,109,0.08)] border border-[rgba(232,184,109,0.2)] rounded-xl p-4 mb-4">
              <p className="text-xs text-[#E8B86D] font-medium mb-2">First time logging in?</p>
              <p className="text-xs text-muted leading-relaxed">
                Admin accounts must be created first via the Supabase dashboard. Visit your Supabase
                project, go to Authentication → Users, and create a new user with your email and a
                password.
              </p>
            </div>

            <p className="text-xs text-muted text-center leading-relaxed">
              Need help? Check the ADMIN_SETUP.md file in your project for detailed instructions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-muted hover:text-white text-sm transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-700 text-white">
                Admin Dashboard
              </h1>
              <p className="text-muted text-sm mt-0.5">Tcoons International — Enquiry Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('image-management')}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-muted hover:text-white text-sm transition-all border-subtle"
              title="Manage Product Images"
            >
              <ImageIcon size={14} />
              <span className="hidden sm:inline">Images</span>
            </button>
            <button
              onClick={() => onNavigate('product-management')}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-muted hover:text-white text-sm transition-all border-subtle"
              title="Manage Products"
            >
              <ShoppingBag size={14} />
              <span className="hidden sm:inline">Products</span>
            </button>
            <button
              onClick={() => onNavigate('content-management')}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-muted hover:text-white text-sm transition-all border-subtle"
              title="Edit Homepage Content"
            >
              <Edit3 size={14} />
              <span className="hidden sm:inline">Content</span>
            </button>
            <button
              onClick={() => {
                fetchEnquiries();
                fetchCartEnquiries();
              }}
              className="p-2 glass rounded-lg text-muted hover:text-white transition-colors border-subtle"
              title="Refresh"
            >
              <RefreshCw
                size={16}
                className={loading || cartLoading ? 'animate-spin' : ''}
              />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-muted hover:text-white text-sm transition-all border-subtle"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? 'gold-gradient text-black'
                : 'glass text-muted hover:text-white border-subtle'
            }`}
          >
            <FileText size={15} />
            Enquiries
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'enquiries' ? 'bg-black/20' : 'bg-white/10'
              }`}
            >
              {enquiries.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'cart'
                ? 'gold-gradient text-black'
                : 'glass text-muted hover:text-white border-subtle'
            }`}
          >
            <ShoppingCart size={15} />
            Cart Enquiries
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'cart' ? 'bg-black/20' : 'bg-white/10'
              }`}
            >
              {cartTotal}
            </span>
          </button>
        </div>

        {/* ==================== ENQUIRIES TAB ==================== */}
        {activeTab === 'enquiries' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                {
                  label: 'Total Enquiries',
                  value: enquiries.length,
                  icon: TrendingUp,
                  color: 'text-[#E8B86D]',
                },
                {
                  label: 'Business Enquiries',
                  value: totalBusiness,
                  icon: Users,
                  color: 'text-blue-400',
                },
                {
                  label: 'Product Enquiries',
                  value: totalProduct,
                  icon: Package,
                  color: 'text-emerald-400',
                },
                {
                  label: 'New / Pending',
                  value: totalNew,
                  icon: Eye,
                  color: 'text-orange-400',
                },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-5 border-subtle">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon size={16} className={stat.color} />
                  </div>
                  <div className={`font-display text-3xl font-800 mb-1 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-5">
              {(['all', 'business', 'product'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    filter === f
                      ? 'gold-gradient text-black'
                      : 'glass text-muted hover:text-white border-subtle'
                  }`}
                >
                  {f === 'all'
                    ? 'All Enquiries'
                    : `${f.charAt(0).toUpperCase() + f.slice(1)} (${f === 'business' ? totalBusiness : totalProduct})`}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size={32} className="text-[#E8B86D]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center border-subtle">
                <p className="text-muted">No enquiries found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="glass rounded-xl p-4 sm:p-5 border-subtle hover:border-white/15 transition-all cursor-pointer"
                    onClick={() =>
                      setSelectedEnquiry(selectedEnquiry?.id === enquiry.id ? null : enquiry)
                    }
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            enquiry.type === 'business' ? 'bg-blue-400' : 'bg-emerald-400'
                          }`}
                        />
                        <div>
                          <div className="font-medium text-white text-sm">{enquiry.name}</div>
                          <div className="text-xs text-muted">{enquiry.mobile}</div>
                        </div>
                        <span
                          className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            enquiry.type === 'business'
                              ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                              : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                          }`}
                        >
                          {enquiry.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {enquiry.product_category && (
                          <span className="text-xs text-muted glass px-2.5 py-1 rounded-lg border-subtle">
                            {enquiry.product_category}
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[enquiry.status]}`}
                        >
                          {enquiry.status}
                        </span>
                        <span className="text-xs text-muted">
                          {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {selectedEnquiry?.id === enquiry.id && (
                      <div className="mt-4 pt-4 border-t border-subtle animate-fade-in">
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-muted mb-1">Email</div>
                            <div className="text-sm text-white">{enquiry.email || '—'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted mb-1">Address</div>
                            <div className="text-sm text-white">{enquiry.address}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted mb-1">Submitted On</div>
                            <div className="text-sm text-white">
                              {new Date(enquiry.created_at).toLocaleString('en-IN')}
                            </div>
                          </div>
                          {enquiry.product_category && (
                            <div>
                              <div className="text-xs text-muted mb-1">Product Category</div>
                              <div className="text-sm text-white">{enquiry.product_category}</div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-muted mr-1">Update Status:</span>
                          {(['new', 'contacted', 'resolved'] as EnquiryStatus[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(enquiry.id, s)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                                enquiry.status === s
                                  ? STATUS_COLORS[s]
                                  : 'glass text-muted hover:text-white border-subtle'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ==================== CART ENQUIRIES TAB ==================== */}
        {activeTab === 'cart' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                {
                  label: 'Total Cart Orders',
                  value: cartTotal,
                  icon: ShoppingCart,
                  color: 'text-[#E8B86D]',
                },
                {
                  label: 'Pending',
                  value: cartNew,
                  icon: Eye,
                  color: 'text-orange-400',
                },
                {
                  label: 'Contacted',
                  value: cartContacted,
                  icon: Phone,
                  color: 'text-blue-400',
                },
                {
                  label: 'Completed',
                  value: cartCompleted,
                  icon: Package,
                  color: 'text-emerald-400',
                },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-5 border-subtle">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon size={16} className={stat.color} />
                  </div>
                  <div className={`font-display text-3xl font-800 mb-1 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted">{stat.label}</div>
                </div>
              ))}
            </div>

            {cartLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size={32} className="text-[#E8B86D]" />
              </div>
            ) : cartEnquiries.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center border-subtle">
                <ShoppingCart size={40} className="text-muted mx-auto mb-4 opacity-50" />
                <p className="text-muted">No cart enquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartEnquiries.map((cart) => {
                  const totalUnits = cart.cart_items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );
                  const isExpanded = selectedCartEnquiry?.id === cart.id;

                  return (
                    <div
                      key={cart.id}
                      className="glass rounded-xl p-4 sm:p-5 border-subtle hover:border-white/15 transition-all"
                    >
                      {/* Summary Row */}
                      <div
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                        onClick={() =>
                          setSelectedCartEnquiry(isExpanded ? null : cart)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#E8B86D]/10 flex items-center justify-center flex-shrink-0">
                            <ShoppingCart size={16} className="text-[#E8B86D]" />
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">
                              {cart.customer_name}
                            </div>
                            <div className="text-xs text-muted flex items-center gap-2">
                              <span>{cart.mobile_number}</span>
                              <span className="text-muted/40">·</span>
                              <span>
                                {cart.cart_items.length} item
                                {cart.cart_items.length === 1 ? '' : 's'} ({totalUnits} unit
                                {totalUnits === 1 ? '' : 's'})
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-xs text-muted font-mono glass px-2.5 py-1 rounded-lg border-subtle"
                          >
                            #{cart.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[cart.status]}`}
                          >
                            {STATUS_LABELS[cart.status] || cart.status}
                          </span>
                          <span className="text-xs text-muted">
                            {new Date(cart.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Detail */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-subtle animate-fade-in space-y-5">
                          {/* Customer Details */}
                          <div>
                            <h4 className="text-xs font-semibold text-[#E8B86D] uppercase tracking-wider mb-3">
                              Customer Details
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <CartDetailField
                                icon={<FileText size={13} />}
                                label="Name"
                                value={cart.customer_name}
                              />
                              <CartDetailField
                                icon={<Phone size={13} />}
                                label="Phone"
                                value={cart.mobile_number}
                              />
                              <CartDetailField
                                icon={<Mail size={13} />}
                                label="Email"
                                value={cart.email || '—'}
                              />
                              <CartDetailField
                                icon={<MapPin size={13} />}
                                label="Address"
                                value={
                                  [cart.address, cart.city, cart.state]
                                    .filter(Boolean)
                                    .join(', ') || '—'
                                }
                              />
                              <CartDetailField
                                icon={<Calendar size={13} />}
                                label="Submitted"
                                value={new Date(cart.created_at).toLocaleString('en-IN')}
                              />
                              <CartDetailField
                                icon={<Hash size={13} />}
                                label="Enquiry ID"
                                value={cart.id.slice(0, 8).toUpperCase()}
                                mono
                              />
                            </div>
                            {cart.message && (
                              <div className="mt-3 p-3 rounded-lg bg-white/5 border border-subtle">
                                <div className="text-xs text-muted mb-1">Notes</div>
                                <p className="text-sm text-white leading-relaxed">{cart.message}</p>
                              </div>
                            )}
                          </div>

                          {/* Ordered Products */}
                          <div>
                            <h4 className="text-xs font-semibold text-[#E8B86D] uppercase tracking-wider mb-3">
                              Ordered Products ({cart.cart_items.length})
                            </h4>
                            <div className="space-y-2">
                              {cart.cart_items.map((item, index) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5 border border-subtle"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-7 h-7 rounded-lg bg-[#E8B86D]/10 flex items-center justify-center flex-shrink-0">
                                      <span className="text-[10px] font-bold text-[#E8B86D]">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-sm text-white font-medium truncate">
                                        {item.name}
                                      </div>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-semibold text-[#E8B86D] uppercase tracking-wider">
                                          {item.category}
                                        </span>
                                        {item.qty && (
                                          <span className="text-xs text-muted">· {item.qty}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-xs text-muted">Qty:</span>
                                    <span className="font-display font-700 text-white text-base">
                                      {item.quantity}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-muted mr-1">Update Status:</span>
                              {(['new', 'contacted', 'resolved'] as EnquiryStatus[]).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => updateCartStatus(cart.id, s)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    cart.status === s
                                      ? STATUS_COLORS[s]
                                      : 'glass text-muted hover:text-white border-subtle'
                                  }`}
                                >
                                  {STATUS_LABELS[s] || s}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => deleteCartEnquiry(cart.id)}
                              disabled={deletingCartId === cart.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                            >
                              {deletingCartId === cart.id ? (
                                <LoadingSpinner size={12} />
                              ) : (
                                <Trash2 size={13} />
                              )}
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CartDetailField({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-muted">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-muted uppercase tracking-wider mb-0.5">{label}</div>
        <div
          className={`text-sm text-white break-words ${mono ? 'font-mono' : ''}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
