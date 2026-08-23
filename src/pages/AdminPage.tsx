import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, TrendingUp, Users, Package, RefreshCw, LogIn, LogOut, Eye, CreditCard as Edit3, ShoppingBag, Image as ImageIcon } from 'lucide-react';
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

  useEffect(() => {
    if (session) fetchEnquiries();
  }, [session, fetchEnquiries]);

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
        password
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
  }

  async function updateStatus(id: string, status: EnquiryStatus) {
    await supabase.from('enquiries').update({ status }).eq('id', id);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry((prev) => prev ? { ...prev, status } : null);
    }
  }

  const filtered = enquiries.filter((e) => filter === 'all' || e.type === filter);
  const totalBusiness = enquiries.filter((e) => e.type === 'business').length;
  const totalProduct = enquiries.filter((e) => e.type === 'product').length;
  const totalNew = enquiries.filter((e) => e.status === 'new').length;

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
                Admin accounts must be created first via the Supabase dashboard. Visit your Supabase project, go to Authentication → Users, and create a new user with your email and a password.
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-muted hover:text-white text-sm transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-700 text-white">Admin Dashboard</h1>
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
              onClick={fetchEnquiries}
              className="p-2 glass rounded-lg text-muted hover:text-white transition-colors border-subtle"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Enquiries', value: enquiries.length, icon: TrendingUp, color: 'text-[#E8B86D]' },
            { label: 'Business Enquiries', value: totalBusiness, icon: Users, color: 'text-blue-400' },
            { label: 'Product Enquiries', value: totalProduct, icon: Package, color: 'text-emerald-400' },
            { label: 'New / Pending', value: totalNew, icon: Eye, color: 'text-orange-400' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5 border-subtle">
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={16} className={stat.color} />
              </div>
              <div className={`font-display text-3xl font-800 mb-1 ${stat.color}`}>{stat.value}</div>
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
              {f === 'all' ? 'All Enquiries' : `${f.charAt(0).toUpperCase() + f.slice(1)} (${f === 'business' ? totalBusiness : totalProduct})`}
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
                onClick={() => setSelectedEnquiry(selectedEnquiry?.id === enquiry.id ? null : enquiry)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${enquiry.type === 'business' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                    <div>
                      <div className="font-medium text-white text-sm">{enquiry.name}</div>
                      <div className="text-xs text-muted">{enquiry.mobile}</div>
                    </div>
                    <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${enquiry.type === 'business' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'}`}>
                      {enquiry.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {enquiry.product_category && (
                      <span className="text-xs text-muted glass px-2.5 py-1 rounded-lg border-subtle">
                        {enquiry.product_category}
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[enquiry.status]}`}>
                      {enquiry.status}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
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
      </div>
    </div>
  );
}
