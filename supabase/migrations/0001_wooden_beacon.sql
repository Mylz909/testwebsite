/*
  # Initial Schema Setup

  1. New Tables
    - products
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - discount_price (numeric, nullable)
      - gender (text)
      - color (text)
      - created_at (timestamp)
      
    - product_images
      - id (uuid, primary key)
      - product_id (uuid, foreign key)
      - url (text)
      - order (integer)
      
    - product_stock
      - id (uuid, primary key)
      - product_id (uuid, foreign key)
      - size (text)
      - quantity (integer)
      
    - orders
      - id (uuid, primary key)
      - customer_name (text)
      - customer_phone (text)
      - customer_address (text)
      - additional_info (text)
      - total_amount (numeric)
      - status (text)
      - created_at (timestamp)
      
    - order_items
      - id (uuid, primary key)
      - order_id (uuid, foreign key)
      - product_id (uuid, foreign key)
      - size (text)
      - quantity (integer)
      - price (numeric)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  discount_price numeric,
  gender text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create product_stock table
CREATE TABLE product_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  size text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, size)
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  additional_info text,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  size text NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON product_stock
  FOR SELECT USING (true);

-- Create function to update stock
CREATE OR REPLACE FUNCTION update_stock() RETURNS TRIGGER AS $$
BEGIN
  UPDATE product_stock
  SET quantity = quantity - NEW.quantity
  WHERE product_id = NEW.product_id AND size = NEW.size;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stock on order
CREATE TRIGGER update_stock_on_order
  AFTER INSERT ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_stock();