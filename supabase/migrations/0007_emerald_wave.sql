-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON product_stock;
DROP POLICY IF EXISTS "Allow insert access" ON orders;
DROP POLICY IF EXISTS "Allow system to update stock" ON product_stock;

-- Create new policies with proper permissions
CREATE POLICY "Anyone can read stock"
  ON product_stock FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "System can update stock"
  ON product_stock FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Add policy for reading orders
CREATE POLICY "Anyone can read orders"
  ON orders FOR SELECT
  TO anon
  USING (true);