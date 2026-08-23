/*
  # Create Product Image Mapping Table

  ## Summary
  Creates a table to store official product images mapped by product ID.
  Allows admins to upload the correct image for each product.

  ## Changes
  - Create product_images table with product_id and image_url
  - Add RLS policies for public read and authenticated write
*/

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  image_url_alt text,
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id)
);

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "allow_read_product_images" ON product_images FOR SELECT
  TO anon, authenticated USING (true);

-- Allow authenticated insert/update/delete
CREATE POLICY "allow_insert_product_images" ON product_images FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "allow_update_product_images" ON product_images FOR UPDATE
  TO authenticated USING (true);

CREATE POLICY "allow_delete_product_images" ON product_images FOR DELETE
  TO authenticated USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
