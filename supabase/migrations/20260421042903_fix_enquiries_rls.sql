/*
  # Fix Enquiries RLS Policy

  ## Summary
  Updates the INSERT policy for enquiries table to be more restrictive
  and ensure proper data validation at the database level.

  ## Changes
  - Replace permissive INSERT policy with restrictive one
  - Ensure only valid data types are inserted
  - Add proper validation checks
*/

DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON enquiries;

CREATE POLICY "Public users can submit enquiry"
  ON enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    type IN ('business', 'product')
    AND name IS NOT NULL AND name != ''
    AND mobile IS NOT NULL AND mobile != ''
    AND address IS NOT NULL AND address != ''
    AND LENGTH(mobile) = 10
    AND mobile ~ '^\d+$'
  );
