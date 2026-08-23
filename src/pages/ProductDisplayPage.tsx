import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, ShoppingBag, Filter, Search, Plus, Check, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  image_url_alt: string | null;
  qty: string;
  featured: boolean;
}

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_url_alt: string | null;
}

interface ProductDisplayPageProps {
  onNavigate: (page: Page, productId?: string) => void;
}

const CATEGORIES = [
  'All Products',
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

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Wellness Product': 'Herbal, Ayurvedic & beauty essentials for holistic health',
  'WellRoot': 'Herbal wellness supplements for immunity, vitality, and holistic health',
  'Agriculture Products': 'Sustainable farming solutions with natural inputs and advanced plant nutrition',
  'Jeeveda Spices': 'Pure, natural, and aromatic spices with authentic flavor and health benefits',
  'Baby Care': 'Gentle, safe and chemical-free products for your little ones',
  'Sniss Cosmetic': 'Skincare, haircare, and beauty essentials enriched with herbal goodness',
  'Sniss Herbal': 'Herbal beauty and health products crafted with natural ingredients',
  'Sniss Elite': 'Premium lifestyle products combining elegance and quality for daily self-care',
  'Sniss Fragrances': 'Premium perfumes and body fragrances for lasting elegance',
  'Oral Care': 'Herbal toothpaste and mouth care for strong teeth and healthy gums',
  'Veterinary': 'Quality care and wellness formulations for livestock and pets',
  'Apparels': 'Premium quality clothing designed for everyday wear and effortless style',
  'Home Care': 'Premium quality cleaning & hygiene essentials with affordable prices',
  'Food Product': 'Nutritious and natural items crafted for a healthy lifestyle',
};

const PAGE_SIZE = 12;

export default function ProductDisplayPage({ onNavigate }: ProductDisplayPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [imageMap, setImageMap] = useState<Map<string, { image_url: string; image_url_alt: string | null }>>(new Map());
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sortBy, setSortBy] = useState<'default' | 'name'>('default');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
    setVisibleCount(PAGE_SIZE);
  }, [products, selectedCategory, searchQuery, sortBy]);

  async function loadData() {
    try {
      const [productsResult, imagesResult] = await Promise.all([
        supabase
          .from('products')
          .select('id, name, category, description, image_url, image_url_alt, qty, featured')
          .eq('active', true)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false }),
        supabase.from('product_images').select('id, product_id, image_url, image_url_alt'),
      ]);

      if (productsResult.error) throw productsResult.error;
      if (imagesResult.error) throw imagesResult.error;

      setProducts((productsResult.data as Product[]) || []);

      const map = new Map<string, { image_url: string; image_url_alt: string | null }>();
      (imagesResult.data || []).forEach((img) => {
        map.set(img.product_id, { image_url: img.image_url, image_url_alt: img.image_url_alt });
      });
      setImageMap(map);
    } catch (err) {
      console.error('Failed to load:', err);
    } finally {
      setLoading(false);
    }
  }

  function getProductImage(productId: string, originalUrl?: string) {
    const mapped = imageMap.get(productId);
    return mapped?.image_url || null;
  }

  function getProductAltImage(productId: string) {
    const mapped = imageMap.get(productId);
    return mapped?.image_url_alt || null;
  }

  function filterProducts() {
    let filtered = products;

    if (selectedCategory !== 'All Products') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  }

  function toggleFavorite(productId: string) {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }

  function handleAddToCart(e: React.MouseEvent, product: Product) {
    e.stopPropagation();
    setAddingToCart(product.id);
    const imageUrl = getProductImage(product.id) || product.image_url;
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      image_url: imageUrl,
      qty: product.qty,
    });
    setTimeout(() => setAddingToCart(null), 1500);
  }

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-[#E8B86D] mb-4 border-subtle">
            <ShoppingBag size={14} />
            AWPL Product Catalog
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-800 text-white mb-3">
            Wellness Products
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Discover our curated collection of premium herbal wellness products by Asclepius Wellness.
            Authentic Ayurvedic formulations for holistic health.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-sm">
            <div className="relative">
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
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="input-dark px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
            >
              <option value="default">Sort: Featured</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'gold-gradient text-black'
                  : 'glass text-muted hover:text-white border-subtle hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-muted">
            {selectedCategory !== 'All Products' && CATEGORY_DESCRIPTIONS[selectedCategory]
              ? CATEGORY_DESCRIPTIONS[selectedCategory]
              : 'Browse all categories of premium AWPL wellness products'}
          </p>
          <p className="text-sm text-muted whitespace-nowrap">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size={40} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-12 text-center border-subtle">
            <p className="text-muted text-lg">No products found.</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleProducts.map((product) => {
              const mappedImage = getProductImage(product.id);
              const mappedAltImage = getProductAltImage(product.id);
              const hasImage = !!mappedImage;

              return (
                <div
                  key={product.id}
                  onClick={() => onNavigate('product-detail', product.id)}
                  className="group glass rounded-2xl overflow-hidden border-subtle hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#E8B86D]/5 flex flex-col h-full cursor-pointer"
                >
                  <div className="relative overflow-hidden bg-gradient-to-b from-white/5 to-transparent aspect-square">
                    {hasImage ? (
                      <img
                        src={
                          hoveredImage === product.id && mappedAltImage
                            ? mappedAltImage
                            : mappedImage
                        }
                        alt={product.name}
                        onMouseEnter={() => mappedAltImage && setHoveredImage(product.id)}
                        onMouseLeave={() => setHoveredImage(null)}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                        <ImageIcon size={40} className="mb-2 opacity-50" />
                        <span className="text-xs">Image Not Available</span>
                      </div>
                    )}

                    {product.featured && (
                      <div className="absolute top-3 left-3">
                        <div className="px-2.5 py-1 rounded-full bg-[#E8B86D]/20 border border-[#E8B86D]/40 backdrop-blur-sm">
                          <span className="text-[10px] font-semibold text-[#E8B86D] uppercase tracking-wide">Bestseller</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-all duration-300"
                    >
                      <Heart
                        size={16}
                        className={`transition-colors ${
                          favorites.has(product.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-white/70 hover:text-white'
                        }`}
                      />
                    </button>

                    {product.qty && (
                      <div className="absolute bottom-3 left-3">
                        <div className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
                          <span className="text-[10px] font-medium text-white/80">{product.qty}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-4">
                    <div className="text-[10px] font-semibold text-[#E8B86D] uppercase tracking-wider mb-1.5">
                      {product.category}
                    </div>

                    <h3 className="font-display font-700 text-white text-sm mb-1.5 leading-tight group-hover:text-[#E8B86D] transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-xs text-muted mb-4 leading-relaxed flex-1 line-clamp-2">
                      {product.description}
                    </p>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full py-2.5 px-4 rounded-xl transition-all font-medium text-xs flex items-center justify-center gap-2 ${
                        isInCart(product.id) && addingToCart !== product.id
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          : addingToCart === product.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#E8B86D]/10 border border-[#E8B86D]/30 text-[#E8B86D] hover:bg-[#E8B86D]/20 hover:border-[#E8B86D]/50'
                      }`}
                    >
                      {isInCart(product.id) && addingToCart !== product.id ? (
                        <>
                          <Check size={12} />
                          In Cart
                        </>
                      ) : addingToCart === product.id ? (
                        <>
                          <Check size={12} />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus size={12} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="flex items-center gap-2 px-6 py-3 glass rounded-xl text-muted hover:text-white border-subtle hover:border-white/20 transition-all text-sm font-medium"
              >
                <ChevronDown size={16} />
                Load More ({filteredProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}

          {!hasMore && filteredProducts.length > PAGE_SIZE && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount(PAGE_SIZE)}
                className="flex items-center gap-2 px-6 py-3 glass rounded-xl text-muted hover:text-white border-subtle hover:border-white/20 transition-all text-sm font-medium"
              >
                <ChevronUp size={16} />
                Show Less
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
