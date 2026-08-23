/*
  # Create Product Images Storage Bucket

  ## Summary
  Creates a storage bucket for product images with public access.
*/

-- Insert storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "allow_public_read_product_images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "allow_authenticated_upload_product_images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update
CREATE POLICY "allow_authenticated_update_product_images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

-- Allow authenticated users to delete
CREATE POLICY "allow_authenticated_delete_product_images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');
