import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_url_alt: string | null;
}

export function useProductImages() {
  const [imageMap, setImageMap] = useState<Map<string, ProductImage>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('id, product_id, image_url, image_url_alt');

      if (error) throw error;

      const map = new Map<string, ProductImage>();
      (data || []).forEach((img) => {
        map.set(img.product_id, img);
      });
      setImageMap(map);
    } catch (err) {
      console.error('Failed to load product images:', err);
    } finally {
      setLoading(false);
    }
  }

  function getProductImage(productId: string): { image_url: string | null; image_url_alt: string | null } | null {
    const img = imageMap.get(productId);
    if (!img) return null;
    return {
      image_url: img.image_url,
      image_url_alt: img.image_url_alt,
    };
  }

  return { imageMap, loading, getProductImage, reloadImages: loadImages };
}
