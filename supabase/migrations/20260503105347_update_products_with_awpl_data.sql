/*
  # Update Products with AWPL Authentic Data

  ## Summary
  Replaces sample products with actual AWPL bestselling products
  including authentic pricing and descriptions.

  ## Changes
  - Delete sample products
  - Insert 12 authentic AWPL bestselling products
  - Include accurate MRP, DP, SP pricing
  - Add product descriptions
  - Use premium product images from Pexels (wellness/ayurvedic products)
*/

-- Delete existing sample products
DELETE FROM products;

-- Insert authentic AWPL bestselling products
INSERT INTO products (name, category, description, image_url, image_url_alt, mrp, dp, sp, featured, active) VALUES
  ('Shiitake Shake (Rabdi Falooda)', 'Wellness Product', 'Nutritious shiitake mushroom beverage with traditional rabdi and falooda flavors. Rich in nutrients and immune-boosting properties.', 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg', 'https://images.pexels.com/photos/5632404/pexels-photo-5632404.jpeg', 678.00, 503.00, 2.00, true, true),
  
  ('Bathveda Neem Tulsi Bar', 'Sniss Herbal', 'Natural soap bar combining neem and tulsi with Ayurvedic benefits. Gentle on skin, naturally antiseptic and purifying.', 'https://images.pexels.com/photos/4631317/pexels-photo-4631317.jpeg', 'https://images.pexels.com/photos/4631319/pexels-photo-4631319.jpeg', 216.00, 165.00, 0.25, true, true),
  
  ('Dentodoc Cream', 'Oral Care', 'Advanced herbal toothpaste formulated for complete oral health. Contains traditional Ayurvedic herbs for strengthened gums and fresh breath.', 'https://images.pexels.com/photos/3938028/pexels-photo-3938028.jpeg', 'https://images.pexels.com/photos/3938029/pexels-photo-3938029.jpeg', 232.00, 206.00, 1.00, true, true),
  
  ('EXE Panch Tulsi Oil', 'Sniss Herbal', 'Premium five-herb tulsi infused oil for holistic wellness. Traditional formulation for immunity and vitality.', 'https://images.pexels.com/photos/6265058/pexels-photo-6265058.jpeg', 'https://images.pexels.com/photos/6265064/pexels-photo-6265064.jpeg', 404.00, 349.00, 2.00, true, true),
  
  ('Gynedoc Ras', 'Wellness Product', 'Specialized Ayurvedic formulation for womens health and hormonal balance. Traditional rasayana supporting vitality and wellness.', 'https://images.pexels.com/photos/4194857/pexels-photo-4194857.jpeg', 'https://images.pexels.com/photos/3860003/pexels-photo-3860003.jpeg', 1442.00, 1244.00, 8.00, true, true),
  
  ('Livodoc Ras', 'Wellness Product', 'Comprehensive liver support formula using traditional Ayurvedic herbs. Supports natural detoxification and hepatic function.', 'https://images.pexels.com/photos/3692757/pexels-photo-3692757.jpeg', 'https://images.pexels.com/photos/3692758/pexels-photo-3692758.jpeg', 1494.00, 1289.00, 8.00, true, true),
  
  ('Immunodoc Ras', 'Wellness Product', 'Powerful immune-boosting Ayurvedic formulation with adaptogenic herbs. Strengthens natural immunity and resilience.', 'https://images.pexels.com/photos/6608234/pexels-photo-6608234.jpeg', 'https://images.pexels.com/photos/6608235/pexels-photo-6608235.jpeg', 2073.00, 1789.00, 12.00, true, true),
  
  ('Thunderblast Ras', 'WellRoot', 'Elite energy and strength formula combining powerful Ayurvedic ingredients. Traditional rasayana for vitality and vigor.', 'https://images.pexels.com/photos/5632340/pexels-photo-5632340.jpeg', 'https://images.pexels.com/photos/5632341/pexels-photo-5632341.jpeg', 2248.00, 1939.00, 13.00, true, true),
  
  ('Orthodoc Pravahi Kwath', 'Wellness Product', 'Specialized joint and mobility support liquid formulation. Traditional Ayurvedic decoction for skeletal and muscular health.', 'https://images.pexels.com/photos/3852560/pexels-photo-3852560.jpeg', 'https://images.pexels.com/photos/3852561/pexels-photo-3852561.jpeg', 2250.00, 1941.00, 13.00, true, true),
  
  ('Nonidoc Juice', 'Food Product', 'Revitalizing herbal juice blend supporting natural detoxification. Fresh blend of Ayurvedic herbs for daily wellness.', 'https://images.pexels.com/photos/8382633/pexels-photo-8382633.jpeg', 'https://images.pexels.com/photos/8382634/pexels-photo-8382634.jpeg', 1149.00, 992.00, 6.00, true, true),
  
  ('Vedik Agro PGPR', 'Agriculture Products', 'Plant Growth Promoting Rhizobacteria formulation for organic farming. Enhances soil health and crop productivity naturally.', 'https://images.pexels.com/photos/4631317/pexels-photo-4631317.jpeg', 'https://images.pexels.com/photos/4631319/pexels-photo-4631319.jpeg', 687.00, 458.00, 3.00, false, true),
  
  ('Vedik Agro Bhuvita', 'Agriculture Products', 'Advanced agricultural biofertilizer supporting sustainable farming. Naturally improves soil nutrition and plant growth.', 'https://images.pexels.com/photos/6294356/pexels-photo-6294356.jpeg', 'https://images.pexels.com/photos/6294357/pexels-photo-6294357.jpeg', 662.00, 441.00, 2.00, false, true);
