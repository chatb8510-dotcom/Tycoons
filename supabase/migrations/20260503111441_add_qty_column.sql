/*
  # Add Qty Column to Products Table

  ## Summary
  Adds a `qty` column to store product quantity information
  (e.g., "500 ML", "100 GM", "30 NUMBER") as displayed on AWPL website.

  ## Changes
  - Add `qty` text column to products table
*/

ALTER TABLE products ADD COLUMN IF NOT EXISTS qty text DEFAULT '';
