/*
  # Fix Database Structure and RLS Policies

  ## Summary
  Comprehensive fix for database structure, RLS policies, and security.
  
  ## Changes
  1. Drop conflicting RLS policies
  2. Recreate enquiries table with proper structure
  3. Add proper RLS policies for public and authenticated access
  4. Ensure homepage_content has correct policies
*/

-- Drop old policies on enquiries
DROP POLICY IF EXISTS "Public users can submit enquiry" ON enquiries;
DROP POLICY IF EXISTS "Authenticated users can view all enquiries" ON enquiries;
DROP POLICY IF EXISTS "Authenticated users can update enquiry status" ON enquiries;
DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON enquiries;

-- Recreate enquiries table if needed (with proper structure)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enquiries' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE enquiries ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create new, clean RLS policies for enquiries
CREATE POLICY "Anyone can submit enquiry"
  ON enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    type IN ('business', 'product')
    AND name IS NOT NULL AND trim(name) != ''
    AND mobile IS NOT NULL AND trim(mobile) != ''
    AND address IS NOT NULL AND trim(address) != ''
  );

CREATE POLICY "Authenticated users view all enquiries"
  ON enquiries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users update enquiries"
  ON enquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix homepage_content policies
DROP POLICY IF EXISTS "Anyone can view homepage content" ON homepage_content;
DROP POLICY IF EXISTS "Only authenticated users can update content" ON homepage_content;

CREATE POLICY "Public view homepage content"
  ON homepage_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated update content"
  ON homepage_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure homepage_content has INSERT policy for admins
CREATE POLICY "Authenticated insert content"
  ON homepage_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(type);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_homepage_content_key ON homepage_content(key);
CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON homepage_content(section);
