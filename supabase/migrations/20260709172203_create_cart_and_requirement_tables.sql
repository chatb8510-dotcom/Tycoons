/*
  # Create Cart Enquiries and Requirement Enquiries Tables

  ## Summary
  Creates tables for storing cart-based enquiries and customer requirement forms.

  ## Tables
  - cart_enquiries: Stores enquiries from the cart checkout
  - requirement_enquiries: Stores customer requirement forms
*/

-- Cart Enquiries Table
CREATE TABLE IF NOT EXISTS cart_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  mobile_number text NOT NULL,
  email text,
  city text,
  state text,
  message text,
  cart_items jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Requirement Enquiries Table
CREATE TABLE IF NOT EXISTS requirement_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  city text,
  requirement_type text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cart_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirement_enquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_enquiries
CREATE POLICY "allow_insert_cart_enquiries" ON cart_enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_read_cart_enquiries" ON cart_enquiries FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "allow_update_cart_enquiries" ON cart_enquiries FOR UPDATE
  TO authenticated USING (true);

-- RLS Policies for requirement_enquiries
CREATE POLICY "allow_insert_requirement_enquiries" ON requirement_enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_read_requirement_enquiries" ON requirement_enquiries FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "allow_update_requirement_enquiries" ON requirement_enquiries FOR UPDATE
  TO authenticated USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cart_enquiries_created_at ON cart_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cart_enquiries_status ON cart_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_requirement_enquiries_created_at ON requirement_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requirement_enquiries_status ON requirement_enquiries(status);
