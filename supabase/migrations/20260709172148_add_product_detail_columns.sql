/*
  # Add Product Detail Columns

  ## Summary
  Adds benefits, usage, and ingredients columns for detailed product information.
  Updates all products with appropriate content for each category.

  ## Changes
  - Add benefits column (text)
  - Add usage column (text)
  - Add ingredients column (text)
*/

ALTER TABLE products ADD COLUMN IF NOT EXISTS benefits text DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS usage text DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients text DEFAULT '';

-- Update Wellness Products with benefits
UPDATE products SET 
  benefits = 'Supports natural immunity, promotes overall wellness, helps maintain vitality and energy levels',
  ingredients = 'Traditional Ayurvedic herbs including Ashwagandha, Giloy, Tulsi, and other natural ingredients',
  usage = 'Take as directed on the product label or as advised by healthcare professional'
WHERE category = 'Wellness Product';

-- Update WellRoot Products
UPDATE products SET 
  benefits = 'Supports immunity, enhances energy and vitality, promotes holistic health with natural ingredients',
  ingredients = 'Natural herbal extracts, vitamins, minerals, and plant-based nutrients',
  usage = 'Follow dosage instructions on product label. Best taken with water or milk'
WHERE category = 'WellRoot';

-- Update Sniss Herbal Products
UPDATE products SET 
  benefits = 'Nourishes skin and hair, promotes natural beauty, gentle and safe for daily use',
  ingredients = 'Aloevera, herbal extracts, natural oils, and plant-based ingredients',
  usage = 'Apply externally as directed. For external use only'
WHERE category = 'Sniss Herbal';

-- Update Sniss Cosmetic Products
UPDATE products SET 
  benefits = 'Long-lasting wear, smooth application, enriched with natural ingredients for radiant beauty',
  ingredients = 'Safe cosmetic ingredients, natural pigments, and herbal extracts',
  usage = 'Apply as needed. Remove with gentle cleanser before sleep'
WHERE category = 'Sniss Cosmetic';

-- Update Sniss Elite Products
UPDATE products SET 
  benefits = 'Premium skincare for radiant skin, anti-aging benefits, deep hydration and nourishment',
  ingredients = 'Hyaluronic acid, Vitamin C, Niacinamide, natural extracts, and premium active ingredients',
  usage = 'Apply morning and night on clean face. Follow with moisturizer'
WHERE category = 'Sniss Elite';

-- Update Sniss Fragrances Products
UPDATE products SET 
  benefits = 'Long-lasting fragrance, elegant scent profile, perfect for daily wear and special occasions',
  ingredients = 'Premium fragrance oils, natural essential oils, and skin-safe compounds',
  usage = 'Spray on pulse points. Avoid contact with eyes'
WHERE category = 'Sniss Fragrances';

-- Update Home Care Products
UPDATE products SET 
  benefits = 'Effective cleaning, safe for family, leaves surfaces sparkling clean with pleasant fragrance',
  ingredients = 'Plant-based surfactants, natural cleansers, and essential oils',
  usage = 'Use as directed on product label. Keep away from children'
WHERE category = 'Home Care';

-- Update Jeeveda Spices Products
UPDATE products SET 
  benefits = 'Adds authentic flavor to dishes, natural and pure, health-enhancing properties of traditional spices',
  ingredients = 'Pure spices, no additives, no artificial colors, sourced from trusted farms',
  usage = 'Add to dishes during cooking for enhanced flavor and aroma'
WHERE category = 'Jeeveda Spices';

-- Update Agriculture Products
UPDATE products SET 
  benefits = 'Promotes sustainable farming, improves soil health, increases crop yield naturally',
  ingredients = 'Beneficial microorganisms, organic nutrients, plant growth promoters',
  usage = 'Apply as per instructions. Suitable for organic farming practices'
WHERE category = 'Agriculture Products';

-- Update Baby Care Products
UPDATE products SET 
  benefits = 'Gentle on babys delicate skin, tear-free formula, safe and natural ingredients',
  ingredients = 'Natural extracts, mild cleansers, no harsh chemicals, pediatrician tested',
  usage = 'Use during bath time. Avoid contact with eyes'
WHERE category = 'Baby Care';

-- Update Oral Care Products
UPDATE products SET 
  benefits = 'Strengthens teeth, freshens breath, promotes healthy gums with herbal goodness',
  ingredients = 'Herbal extracts, natural cleansers, fluoride as per dental standards',
  usage = 'Brush twice daily. Visit dentist regularly'
WHERE category = 'Oral Care';

-- Update Veterinary Products
UPDATE products SET 
  benefits = 'Supports animal health and nutrition, promotes growth and vitality in livestock',
  ingredients = 'Animal-safe nutrients, vitamins, minerals formulated for veterinary use',
  usage = 'Administer as per livestock health requirements. Consult veterinarian'
WHERE category = 'Veterinary';

-- Update Apparels Products
UPDATE products SET 
  benefits = 'Premium quality fabric, comfortable fit, stylish design for everyday wear',
  ingredients = 'High-quality fabric, comfortable stitching, branded materials',
  usage = 'Machine washable. Follow care instructions on label'
WHERE category = 'Apparels';

-- Update Food Products
UPDATE products SET 
  benefits = 'Nutritious and natural, supports healthy lifestyle, authentic taste with wellness benefits',
  ingredients = 'Natural food ingredients, no preservatives, sourced from trusted suppliers',
  usage = 'Consume as part of balanced diet. Store in cool dry place'
WHERE category = 'Food Product';
