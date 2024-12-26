/*
  # Update product sizes to M, L, XL

  1. Changes
    - Merge XXL quantities into XL
    - Add size M support
    - Add constraints to ensure valid sizes
*/

-- First merge XXL quantities into XL where both exist
UPDATE product_stock ps1
SET quantity = ps1.quantity + ps2.quantity
FROM product_stock ps2
WHERE ps1.product_id = ps2.product_id
AND ps1.size = 'XL'
AND ps2.size = 'XXL';

-- Delete XXL records after merging
DELETE FROM product_stock
WHERE size = 'XXL';

-- Update order items to use XL instead of XXL
UPDATE order_items 
SET size = 'XL' 
WHERE size = 'XXL';

-- Now add the constraints
ALTER TABLE product_stock DROP CONSTRAINT IF EXISTS valid_sizes;
ALTER TABLE product_stock ADD CONSTRAINT valid_sizes 
  CHECK (size IN ('M', 'L', 'XL'));

ALTER TABLE order_items DROP CONSTRAINT IF EXISTS valid_sizes;
ALTER TABLE order_items ADD CONSTRAINT valid_sizes 
  CHECK (size IN ('M', 'L', 'XL'));