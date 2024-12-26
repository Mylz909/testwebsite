-- Drop unused tables and their dependencies
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_stock CASCADE;

-- Create simplified tables
CREATE TABLE product_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  size text NOT NULL CHECK (size IN ('M', 'L', 'XL')),
  quantity integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, size)
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  additional_info text,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE product_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON product_stock
  FOR SELECT USING (true);

CREATE POLICY "Allow insert access" ON orders
  FOR INSERT WITH CHECK (true);

-- Create function to update stock
CREATE OR REPLACE FUNCTION update_stock() RETURNS TRIGGER AS $$
DECLARE
  item jsonb;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    -- Check if there's enough stock
    IF NOT EXISTS (
      SELECT 1 FROM product_stock 
      WHERE product_id = (item->>'product_id')::text 
      AND size = (item->>'size')::text 
      AND quantity >= (item->>'quantity')::integer
    ) THEN
      RAISE EXCEPTION 'Insufficient stock for product % size %', 
        (item->>'product_id'), (item->>'size');
    END IF;

    -- Update stock
    UPDATE product_stock
    SET quantity = quantity - (item->>'quantity')::integer
    WHERE product_id = (item->>'product_id')::text 
    AND size = (item->>'size')::text;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_stock_on_order
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_stock();