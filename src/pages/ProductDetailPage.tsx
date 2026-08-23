import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Heart, Check, Package, Leaf, Sparkles, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page, Product } from '../types';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface ProductDetailPageProps {
  productId: string | null;
  onNavigate: (page: Page, productId?: string) => void;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Wellness Product': 'Herbal, Ayurvedic & beauty essentials for holistic health',
  'WellRoot': 'Herbal wellness supplements for immunity, vitality, and holistic health',
  'Agriculture Products': 'Sustainable farming solutions with natural inputs',
  'Jeeveda Spices': 'Pure, natural, and aromatic spices with authentic flavor',
  'Baby Care': 'Gentle, safe and chemical-free products for your little ones',
  'Sniss Cosmetic': 'Skincare, haircare, and beauty essentials enriched with herbal goodness',
  'Sniss Herbal': 'Herbal beauty and health products crafted with natural ingredients',
  'Sniss Elite': 'Premium lifestyle products for daily self-care',
  'Sniss Fragrances': 'Premium perfumes and body fragrances',
  'Oral Care': 'Herbal toothpaste and mouth care for strong teeth',
  'Veterinary': 'Quality care and wellness formulations for livestock and pets',
  'Apparels': 'Premium quality clothing for everyday wear',
  'Home Care': 'Premium quality cleaning & hygiene essentials',
  'Food Product': 'Nutritious and natural items for a healthy lifestyle',
};

export default function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [mappedImageUrl, setMappedImageUrl] = useState<string | null>(null);
  const [mappedAltImageUrl, setMappedAltImageUrl] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedImageMap, setRelatedImageMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  async function loadProduct() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      if (data) {
        setProduct(data as Product);
        setAddedToCart(isInCart(data.id));
        loadProductImage(data.id);
        loadRelatedProducts(data.category, data.id);
      }
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadProductImage(prodId: string) {
    const { data } = await supabase
      .from('product_images')
      .select('image_url, image_url_alt')
      .eq('product_id', prodId)
      .single();

    if (data) {
      setMappedImageUrl(data.image_url);
      setMappedAltImageUrl(data.image_url_alt);
    }
  }

  async function loadRelatedProducts(category: string, currentId: string) {
    const [productsResult, imagesResult] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, category, description, image_url, image_url_alt, qty, featured, benefits, usage, ingredients')
        .eq('category', category)
        .neq('id', currentId)
        .limit(4),
      supabase.from('product_images').select('product_id, image_url'),
    ]);

    setRelatedProducts((productsResult.data as Product[]) || []);

    const map = new Map<string, string>();
    (imagesResult.data || []).forEach((img) => {
      map.set(img.product_id, img.image_url);
    });
    setRelatedImageMap(map);
  }

  function handleAddToCart() {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      image_url: mappedImageUrl || product.image_url,
      qty: product.qty,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  const displayImage = mappedImageUrl;
  const displayAltImage = mappedAltImageUrl;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <Package size={48} className="text-muted mb-4" />
        <p className="text-muted text-lg mb-4">Product not found</p>
        <button
          onClick={() => onNavigate('products')}
          className="px-6 py-3 gold-gradient rounded-xl text-black font-medium"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <div className="relative">
            <div className="glass rounded-3xl overflow-hidden border-subtle aspect-square flex items-center justify-center">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                  <ImageIcon size={64} className="mb-3 opacity-50" />
                  <span className="text-lg">Image Not Available</span>
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1.5 rounded-full bg-[#E8B86D]/20 border border-[#E8B86D]/40 backdrop-blur-sm">
                    <span className="text-xs font-semibold text-[#E8B86D] uppercase tracking-wide">Bestseller</span>
                  </div>
                </div>
              )}
            </div>
            {product.qty && (
              <div className="absolute bottom-4 left-4 glass px-4 py-2 rounded-xl border-subtle">
                <span className="text-sm font-medium text-white">{product.qty}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-[#E8B86D] text-xs font-semibold uppercase tracking-wider mb-3">
              <Leaf size={14} />
              {product.category}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-800 text-white mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="text-muted text-lg leading-relaxed mb-6">
              {product.description}
            </p>

            {product.benefits && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-white font-semibold mb-2">
                  <Sparkles size={18} className="text-[#E8B86D]" />
                  Benefits
                </div>
                <p className="text-muted leading-relaxed">{product.benefits}</p>
              </div>
            )}

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium text-sm transition-all ${
                  addedToCart
                    ? 'bg-emerald-500 text-white'
                    : 'gold-gradient text-black hover:bg-[#F5C67D]'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={18} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-4 rounded-xl border transition-all ${
                  isFavorite
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'glass border-subtle hover:border-white/20'
                }`}
              >
                <Heart
                  size={20}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-muted'}
                />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <div className="glass px-4 py-2 rounded-lg border-subtle">
                <span className="text-xs text-muted">{CATEGORY_DESCRIPTIONS[product.category] || product.category}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {product.usage && (
            <div className="glass rounded-2xl p-6 border-subtle">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8B86D]/10 flex items-center justify-center">
                  <Package size={20} className="text-[#E8B86D]" />
                </div>
                <h3 className="font-display font-700 text-white">Usage</h3>
              </div>
              <p className="text-muted text-sm leading-relaxed">{product.usage}</p>
            </div>
          )}

          {product.ingredients && (
            <div className="glass rounded-2xl p-6 border-subtle">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Leaf size={20} className="text-emerald-400" />
                </div>
                <h3 className="font-display font-700 text-white">Ingredients</h3>
              </div>
              <p className="text-muted text-sm leading-relaxed">{product.ingredients}</p>
            </div>
          )}

          <div className="glass rounded-2xl p-6 border-subtle">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
                <Sparkles size={20} className="text-blue-400" />
              </div>
              <h3 className="font-display font-700 text-white">Category</h3>
            </div>
            <p className="text-white font-medium mb-1">{product.category}</p>
            <p className="text-muted text-sm leading-relaxed">
              {CATEGORY_DESCRIPTIONS[product.category] || 'Premium wellness product'}
            </p>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl sm:text-3xl font-700 text-white">
                Related Products
              </h2>
              <button
                onClick={() => onNavigate('products')}
                className="text-[#E8B86D] hover:text-white text-sm font-medium transition-colors"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => {
                const rpImage = relatedImageMap.get(rp.id);

                return (
                  <button
                    key={rp.id}
                    onClick={() => onNavigate('product-detail', rp.id)}
                    className="glass rounded-xl overflow-hidden border-subtle hover:border-white/20 transition-all text-left group"
                  >
                    <div className="aspect-square overflow-hidden flex items-center justify-center">
                      {rpImage ? (
                        <img
                          src={rpImage}
                          alt={rp.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                          <ImageIcon size={24} className="opacity-50" />
                          <span className="text-[10px] mt-1">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-[10px] font-semibold text-[#E8B86D] uppercase tracking-wider mb-1">
                        {rp.category}
                      </div>
                      <h3 className="font-display font-700 text-white text-sm leading-tight line-clamp-2 group-hover:text-[#E8B86D] transition-colors">
                        {rp.name}
                      </h3>
                      {rp.qty && (
                        <div className="mt-2">
                          <span className="text-xs text-muted">{rp.qty}</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
