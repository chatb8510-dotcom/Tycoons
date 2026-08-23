import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Check, X, Image as ImageIcon, Search, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Product {
  id: string;
  name: string;
  category: string;
  qty: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_url_alt: string | null;
}

interface ProductDisplay extends Product {
  image_url?: string;
  image_url_alt?: string | null;
  has_mapped_image?: boolean;
  image_id?: string;
}

interface ImageManagementPageProps {
  onNavigate: (page: Page) => void;
}

export default function ImageManagementPage({ onNavigate }: ImageManagementPageProps) {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploading, setUploading] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const CATEGORIES = [
    'All',
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

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, category, qty')
        .eq('active', true)
        .order('name');

      if (productsError) throw productsError;

      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('id, product_id, image_url, image_url_alt');

      if (imagesError) throw imagesError;

      const imageMap = new Map<string, ProductImage>();
      (imagesData || []).forEach((img) => {
        imageMap.set(img.product_id, img);
      });

      const mergedProducts: ProductDisplay[] = (productsData || []).map((p) => {
        const mapped = imageMap.get(p.id);
        return {
          ...p,
          image_url: mapped?.image_url,
          image_url_alt: mapped?.image_url_alt,
          has_mapped_image: !!mapped,
          image_id: mapped?.id,
        };
      });

      setProducts(mergedProducts);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(productId: string, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(productId);

    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      const { error: dbError } = await supabase
        .from('product_images')
        .upsert(
          { product_id: productId, image_url: imageUrl, updated_at: new Date().toISOString() },
          { onConflict: 'product_id' }
        );

      if (dbError) throw dbError;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, image_url: imageUrl, has_mapped_image: true }
            : p
        )
      );

      setSuccess(`Image uploaded for ${product.name}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(null);
      event.target.value = '';
    }
  }

  async function handleDeleteImage(productId: string) {
    if (!confirm('Remove this product image?')) return;

    try {
      const product = products.find((p) => p.id === productId);
      if (!product?.image_id) return;

      await supabase.from('product_images').delete().eq('id', product.image_id);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, image_url: undefined, has_mapped_image: false, image_id: undefined }
            : p
        )
      );
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to remove image');
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const completedCount = products.filter((p) => p.has_mapped_image).length;
  const totalCount = products.length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center gap-2 text-muted hover:text-white text-sm mb-6 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Admin
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-800 text-white mb-2">
              Product Image Manager
            </h1>
            <p className="text-muted">
              Upload official product images. {completedCount} of {totalCount} completed.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#E8B86D]">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </div>
            <div className="text-xs text-muted">mapped</div>
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-400/10 border border-emerald-400/30 rounded-xl text-emerald-300 text-sm flex items-center gap-2">
            <Check size={16} />
            {success}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-dark w-full pl-12 pr-4 py-3 rounded-xl text-sm"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-dark px-4 py-3 rounded-xl text-sm min-w-[200px]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const isUploading = uploading === product.id;

              return (
                <div
                  key={product.id}
                  className="glass rounded-xl p-4 border-subtle flex items-center gap-4"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                    {product.has_mapped_image && product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '';
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-muted flex flex-col items-center">
                        <ImageIcon size={24} />
                        <span className="text-[8px] mt-1">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-[#E8B86D] uppercase tracking-wider">
                      {product.category}
                    </div>
                    <h3 className="font-display font-700 text-white text-sm truncate">
                      {product.name}
                    </h3>
                    {product.qty && <span className="text-xs text-muted">{product.qty}</span>}
                  </div>

                  <div className="flex-shrink-0">
                    {product.has_mapped_image ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <Check size={12} />
                        Mapped
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(product.id, e)}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isUploading
                            ? 'bg-white/5 text-muted cursor-wait'
                            : 'bg-[#E8B86D]/10 text-[#E8B86D] hover:bg-[#E8B86D]/20 border border-[#E8B86D]/30'
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={14} />
                            <span>Upload</span>
                          </>
                        )}
                      </div>
                    </label>

                    {product.has_mapped_image && (
                      <button
                        onClick={() => handleDeleteImage(product.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="glass rounded-xl p-8 text-center border-subtle">
            <p className="text-muted">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
