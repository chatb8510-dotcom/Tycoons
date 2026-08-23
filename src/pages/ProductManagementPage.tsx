import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, CreditCard as Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  image_url_alt: string | null;
  mrp: number;
  dp: number;
  sp: number;
  qty: string;
  featured: boolean;
  active: boolean;
}

interface ProductManagementPageProps {
  onNavigate: (page: Page) => void;
}

const CATEGORIES = [
  'Wellness Product',
  'WellRoot',
  'Agriculture Products',
  'Jeeveda Spices',
  'Baby Care',
  'Sniss Cosmetic',
  'Sniss Herbal',
  'Sniss Elite',
  'Sniss Fragrances',
  'Oral Care',
  'Veterinary',
  'Apparels',
  'Home Care',
  'Food Product',
];

export default function ProductManagementPage({ onNavigate }: ProductManagementPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Wellness Product',
    description: '',
    image_url: '',
    image_url_alt: '',
    mrp: 0,
    dp: 0,
    sp: 0,
    qty: '',
    featured: false,
    active: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error: err } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (err) throw err;
      setProducts(data || []);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!formData.name || !formData.category || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editing) {
        const { error: err } = await supabase.from('products').update(formData).eq('id', editing.id);
        if (err) throw err;
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...formData } : p)));
        setSuccess('Product updated successfully');
      } else {
        const { data, error: err } = await supabase.from('products').insert([formData]).select();
        if (err) throw err;
        if (data) setProducts((prev) => [data[0], ...prev]);
        setSuccess('Product created successfully');
      }
      setEditing(null);
      setShowForm(false);
      setFormData({
        name: '',
        category: 'Wellness Product',
        description: '',
        image_url: '',
        image_url_alt: '',
        mrp: 0,
        dp: 0,
        sp: 0,
        qty: '',
        featured: false,
        active: true,
      });
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error: err } = await supabase.from('products').delete().eq('id', id);
      if (err) throw err;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSuccess('Product deleted successfully');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  }

  function startEdit(product: Product) {
    setEditing(product);
    setFormData(product);
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Admin
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-800 text-white mb-3">
              Product Management
            </h1>
            <p className="text-muted text-base">Manage your product catalog</p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setFormData({
                name: '',
                category: 'Wellness Product',
                description: '',
                image_url: '',
                image_url_alt: '',
                mrp: 0,
                dp: 0,
                sp: 0,
                qty: '',
                featured: false,
                active: true,
              });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-3 bg-[#E8B86D] text-black rounded-xl font-medium hover:bg-[#F5C67D] transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-400/10 border border-red-400/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-400/10 border border-green-400/30 rounded-xl text-green-300 text-sm">
            {success}
          </div>
        )}

        {/* Product Form */}
        {showForm && (
          <div className="glass rounded-2xl p-6 mb-8 border-subtle">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-700 text-white">
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-muted" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="Product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Category *</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">MRP (₹) *</label>
                <input
                  type="number"
                  value={formData.mrp || 0}
                  onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) })}
                  className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">DP (₹) *</label>
                <input
                  type="number"
                  value={formData.dp || 0}
                  onChange={(e) => setFormData({ ...formData, dp: parseFloat(e.target.value) })}
                  className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">SP (₹) *</label>
                <input
                  type="number"
                  value={formData.sp || 0}
                  onChange={(e) => setFormData({ ...formData, sp: parseFloat(e.target.value) })}
                  className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Qty (e.g. 500 ML, 100 GM)</label>
                <input
                  type="text"
                  value={formData.qty || ''}
                  onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="500 ML"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Image URL *</label>
                <input
                  type="text"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Alt Image URL</label>
                <input
                  type="text"
                  value={formData.image_url_alt || ''}
                  onChange={(e) => setFormData({ ...formData, image_url_alt: e.target.value })}
                  className="input-dark w-full px-4 py-3 rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#cccccc] mb-2">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="input-dark w-full px-4 py-3 rounded-lg text-sm resize-none"
                  placeholder="Product description"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-[#cccccc]">Featured (Bestseller)</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active || true}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-[#cccccc]">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-[#E8B86D] text-black rounded-lg font-medium hover:bg-[#F5C67D] transition-colors"
              >
                <Save size={18} />
                Save Product
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="px-6 py-3 glass rounded-lg text-muted hover:text-white border-subtle transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="grid gap-4">
          {products.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center border-subtle">
              <p className="text-muted">No products yet. Create your first product!</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="glass rounded-xl p-4 border-subtle hover:border-white/15 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-display font-700 text-white mb-1">{product.name}</h3>
                    <div className="text-sm text-muted mb-2">
                      {product.category} {!product.active && '· (Inactive)'}
                      {product.featured && '· Bestseller'}
                    </div>
                    <div className="text-xs text-muted">
                      MRP: ₹{product.mrp.toFixed(0)} | DP: ₹{product.dp.toFixed(0)} | SP: ₹{product.sp.toFixed(0)}{product.qty ? ` | Qty: ${product.qty}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} className="text-[#E8B86D]" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
