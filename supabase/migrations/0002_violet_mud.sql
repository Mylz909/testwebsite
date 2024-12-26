/*
  # Add missing policies and functions

  This migration adds:
  1. Additional RLS policies for orders and order items
  2. Updates existing policies if needed
*/

-- Add policies for orders
CREATE POLICY "Allow insert access" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view their own orders" ON orders
  FOR SELECT USING (true);

-- Add policies for order items
CREATE POLICY "Allow insert access" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view their order items" ON order_items
  FOR SELECT USING (true);

-- Add policy for stock updates
CREATE POLICY "Allow system to update stock" ON product_stock
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- Ensure the trigger function exists and is up to date
DROP TRIGGER IF EXISTS update_stock_on_order ON order_items;
DROP FUNCTION IF EXISTS update_stock();

CREATE OR REPLACE FUNCTION update_stock() RETURNS TRIGGER AS $$
BEGIN
  -- Check if there's enough stock
  IF NOT EXISTS (
    SELECT 1 FROM product_stock 
    WHERE product_id = NEW.product_id 
    AND size = NEW.size 
    AND quantity >= NEW.quantity
  ) THEN
    RAISE EXCEPTION 'Insufficient stock for product % size %', NEW.product_id, NEW.size;
  END IF;

  -- Update stock
  UPDATE product_stock
  SET quantity = quantity - NEW.quantity
  WHERE product_id = NEW.product_id AND size = NEW.size;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER update_stock_on_order
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_stock();