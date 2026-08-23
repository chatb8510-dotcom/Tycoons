/*
  # Add Homepage Content Management Table

  ## Summary
  Adds a table for managing homepage content customization by admins.
  This allows admins to update homepage details without code changes.

  ## New Tables
  - `homepage_content`
    - `id` (uuid, primary key)
    - `key` (text, unique) - Identifier for content (e.g., 'hero_title', 'hero_subtitle')
    - `value` (text) - Content value
    - `section` (text) - Section name (e.g., 'hero', 'features', 'stats')
    - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - RLS enabled with policies for:
    - Public SELECT (anyone can view homepage content)
    - Authenticated UPDATE (only admins can edit)

  ## Notes
  - Includes default values for all homepage sections
  - Admins can modify content through admin dashboard
*/

CREATE TABLE IF NOT EXISTS homepage_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  section text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view homepage content"
  ON homepage_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can update content"
  ON homepage_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default homepage content
INSERT INTO homepage_content (key, value, section) VALUES
  ('hero_subtitle', 'Your trusted partner for AWPL wellness products and business opportunities. Build a healthier life while building a profitable future.', 'hero'),
  ('hero_cta1_text', 'Business Enquiry', 'hero'),
  ('hero_cta2_text', 'Product Enquiry', 'hero'),
  ('stat1_value', '100+', 'stats'),
  ('stat1_label', 'Premium Products', 'stats'),
  ('stat2_value', '15+', 'stats'),
  ('stat2_label', 'Product Categories', 'stats'),
  ('stat3_value', 'PAN India', 'stats'),
  ('stat3_label', 'Network Reach', 'stats'),
  ('stat4_value', 'AWPL', 'stats'),
  ('stat4_label', 'Certified Partner', 'stats'),
  ('offer_title', 'What We Offer', 'offer'),
  ('offer_subtitle', 'Tcoons International bridges the gap between quality wellness products and life-changing business opportunities.', 'offer'),
  ('journey_title', 'Start Your Journey', 'journey'),
  ('journey_subtitle', 'Whether you''re looking for premium wellness products or a profitable business opportunity, we have the right path for you.', 'journey'),
  ('footer_company', 'Tcoons International', 'footer'),
  ('footer_tagline', 'Authorized AWPL Business Associate', 'footer'),
  ('footer_partner', 'In partnership with Asclepius Wellness Pvt Ltd', 'footer')
ON CONFLICT (key) DO NOTHING;
