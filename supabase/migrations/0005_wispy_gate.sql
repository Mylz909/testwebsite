-- Drop existing triggers and functions with CASCADE
DROP TRIGGER IF EXISTS update_stock_on_order ON order_items;
DROP TRIGGER IF EXISTS update_stock_on_order ON orders;
DROP FUNCTION IF EXISTS update_stock() CASCADE;

-- Create new function to update stock
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

-- Create new trigger on order_items table
CREATE TRIGGER update_stock_on_order
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_stock();

-- Update RLS policies
DROP POLICY IF EXISTS "Allow public read access" ON product_stock;
DROP POLICY IF EXISTS "Allow insert access" ON orders;

CREATE POLICY "Allow public read access" ON product_stock
  FOR SELECT USING (true);

CREATE POLICY "Allow insert access" ON orders
  FOR INSERT WITH CHECK (true);