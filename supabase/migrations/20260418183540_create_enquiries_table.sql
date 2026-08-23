/*
  # Create Enquiries Table

  ## Summary
  Creates the core enquiries table for Tcoons International lead generation website.

  ## New Tables
  - `enquiries`
    - `id` (uuid, primary key) - Unique identifier
    - `type` (text) - Either 'business' or 'product'
    - `name` (text, NOT NULL) - Full name of enquirer
    - `mobile` (text, NOT NULL) - Mobile number (mandatory)
    - `email` (text, nullable) - Email address (optional)
    - `address` (text, NOT NULL) - Full address (mandatory)
    - `product_category` (text, nullable) - Only for product enquiries
    - `status` (text) - Enquiry status: 'new', 'contacted', 'resolved'
    - `created_at` (timestamptz) - Submission timestamp

  ## Security
  - RLS enabled with policies for:
    - Public INSERT (anyone can submit enquiry)
    - Authenticated SELECT (admins can view all)
    - Authenticated UPDATE (admins can update status)

  ## Notes
  - product_category is only populated for type='product' enquiries
  - status defaults to 'new' for all incoming enquiries
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('business', 'product')),
  name text NOT NULL,
  mobile text NOT NULL,
  email text,
  address text NOT NULL,
  product_category text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(type);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an enquiry"
  ON enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all enquiries"
  ON enquiries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update enquiry status"
  ON enquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
