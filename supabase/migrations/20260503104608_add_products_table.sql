/*
  # Create Products Table for E-Commerce

  ## Summary
  Creates products table for Tcoons International e-commerce platform
  with AWPL-style product display.

  ## New Tables
  - `products`
    - `id` (uuid, primary key)
    - `name` (text) - Product name
    - `category` (text) - Product category
    - `description` (text) - Product description
    - `image_url` (text) - Primary product image
    - `image_url_alt` (text) - Alternate product image (optional)
    - `mrp` (decimal) - Maximum Retail Price
    - `dp` (decimal) - Distributor Price
    - `sp` (decimal) - Selling Price / Commission
    - `featured` (boolean) - Show in featured section
    - `active` (boolean) - Product is active/available
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled with policies for:
    - Public SELECT (anyone can view active products)
    - Authenticated UPDATE (admins can manage products)

  ## Notes
  - Images use Pexels URLs for premium wellness product photography
  - MRP, DP, SP support product pricing tiers
  - Featured flag highlights bestsellers
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  image_url_alt text,
  mrp decimal(10,2) NOT NULL,
  dp decimal(10,2) NOT NULL,
  sp decimal(10,2) NOT NULL,
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Authenticated manage products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Insert sample products with premium wellness imagery from Pexels
INSERT INTO products (name, category, description, image_url, image_url_alt, mrp, dp, sp, featured, active) VALUES
  ('Premium Herbal Wellness Set', 'Wellness Product', 'Ayurvedic herbal wellness collection with natural ingredients', 'https://images.pexels.com/photos/4194857/pexels-photo-4194857.jpeg', 'https://images.pexels.com/photos/3860003/pexels-photo-3860003.jpeg', 1299.00, 899.00, 599.00, true, true),
  ('WellRoot Organic Tea', 'WellRoot', 'Premium organic herbal tea blend with adaptogenic herbs', 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg', 'https://images.pexels.com/photos/5632404/pexels-photo-5632404.jpeg', 699.00, 499.00, 349.00, true, true),
  ('Organic Turmeric Powder', 'Agriculture Products', 'Pure organic turmeric with natural anti-inflammatory properties', 'https://images.pexels.com/photos/6608234/pexels-photo-6608234.jpeg', 'https://images.pexels.com/photos/6608235/pexels-photo-6608235.jpeg', 449.00, 299.00, 199.00, true, true),
  ('Jeeveda Spice Collection', 'Jeeveda Spices', 'Authentic Ayurvedic spices for culinary and wellness use', 'https://images.pexels.com/photos/4631317/pexels-photo-4631317.jpeg', 'https://images.pexels.com/photos/4631319/pexels-photo-4631319.jpeg', 899.00, 599.00, 399.00, true, true),
  ('Natural Baby Care Set', 'Baby Care', 'Gentle, natural baby care products for sensitive skin', 'https://images.pexels.com/photos/8382633/pexels-photo-8382633.jpeg', 'https://images.pexels.com/photos/8382634/pexels-photo-8382634.jpeg', 999.00, 699.00, 499.00, true, true),
  ('Sniss Herbal Face Cream', 'Sniss Herbal', 'Luxurious herbal face cream with botanical extracts', 'https://images.pexels.com/photos/6265058/pexels-photo-6265058.jpeg', 'https://images.pexels.com/photos/6265064/pexels-photo-6265064.jpeg', 799.00, 549.00, 349.00, true, true),
  ('Sniss Premium Serum', 'Sniss Cosmetic', 'Advanced anti-aging serum with herbal peptides', 'https://images.pexels.com/photos/3692757/pexels-photo-3692757.jpeg', 'https://images.pexels.com/photos/3692758/pexels-photo-3692758.jpeg', 1499.00, 999.00, 699.00, true, true),
  ('Organic Oral Care Gel', 'Oral Care', 'Natural herbal gel for oral health and fresh breath', 'https://images.pexels.com/photos/3938028/pexels-photo-3938028.jpeg', 'https://images.pexels.com/photos/3938029/pexels-photo-3938029.jpeg', 399.00, 249.00, 149.00, false, true),
  ('Sniss Fragrance - Lavender', 'Sniss Fragrances', 'Premium natural fragrance with lavender essential oils', 'https://images.pexels.com/photos/3734093/pexels-photo-3734093.jpeg', 'https://images.pexels.com/photos/3734094/pexels-photo-3734094.jpeg', 599.00, 399.00, 249.00, true, true),
  ('Herbal Home Care Spray', 'Home Care', 'All-natural antibacterial herbal home care spray', 'https://images.pexels.com/photos/6294356/pexels-photo-6294356.jpeg', 'https://images.pexels.com/photos/6294357/pexels-photo-6294357.jpeg', 349.00, 229.00, 129.00, false, true),
  ('Premium Wellness Coffee', 'Food Product', 'Organic coffee blend with adaptogenic herbs', 'https://images.pexels.com/photos/5632340/pexels-photo-5632340.jpeg', 'https://images.pexels.com/photos/5632341/pexels-photo-5632341.jpeg', 549.00, 349.00, 249.00, true, true),
  ('Sniss Elite Gold Mask', 'Sniss Elite', 'Luxury facial mask with gold particles and herbal extracts', 'https://images.pexels.com/photos/3852560/pexels-photo-3852560.jpeg', 'https://images.pexels.com/photos/3852561/pexels-photo-3852561.jpeg', 1299.00, 849.00, 599.00, true, true);
