/*
# Update cart_enquiries: add address column and delete policy

## Summary
Adds an `address` column to the `cart_enquiries` table so the user can submit their full address (street, city, state, pincode) as part of the cart enquiry — matching the request to capture Address/City alongside Name, Phone, Email, and Notes.

Also adds a DELETE policy so admins can remove cart enquiries from the dashboard.

## Changes
1. `cart_enquiries` table:
   - New column: `address` (text, nullable) — full customer address.
2. RLS policies:
   - New DELETE policy for authenticated users (admins can delete cart enquiries).
3. Notes:
   - Existing rows get `address = NULL` which the UI treats as "not provided".
   - No data is lost; the column is purely additive.
*/

ALTER TABLE cart_enquiries
  ADD COLUMN IF NOT EXISTS address text;

DROP POLICY IF EXISTS "allow_delete_cart_enquiries" ON cart_enquiries;
CREATE POLICY "allow_delete_cart_enquiries"
  ON cart_enquiries FOR DELETE
  TO authenticated USING (true);
