/*
# Consolidated Schema Migration

This migration provides a clean, idempotent way to set up the database schema
for the ModernShop application. It checks for existing tables and objects
before creating them to avoid errors.

## Tables Created:
- categories
- products
- profiles
- orders
- order_items
- cart_items
- reviews
- product_images

## Functions Created:
- generate_unique_username
- handle_new_user
- deduct_stock
- get_product_images

## Views Created:
- product_details

## Sample Data:
- Categories: Electronics, Home & Office, Accessories
- Products: 10 sample products with images
*/

-- Start transaction
BEGIN;

-- Check and create categories table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN
    CREATE TABLE categories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text UNIQUE NOT NULL,
      description text,
      image_url text,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Check and create products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    CREATE TABLE products (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text,
      price numeric(10,2) NOT NULL,
      image_url text,
      category text NOT NULL,
      stock integer NOT NULL DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      category_id uuid REFERENCES categories(id)
    );
  END IF;
END $$;

-- Add unique constraint to products if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_product_name_category'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT unique_product_name_category UNIQUE (name, category);
  END IF;
END $$;

-- Check and create profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE profiles (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      full_name text,
      address text,
      phone text,
      username text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
    
    -- Add unique constraint on username
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
END $$;

-- Check and create orders table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    CREATE TABLE orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users ON DELETE CASCADE,
      total_price numeric(10,2) NOT NULL,
      status text CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Check and create order_items table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items') THEN
    CREATE TABLE order_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id uuid REFERENCES orders ON DELETE CASCADE,
      product_id uuid REFERENCES products ON DELETE CASCADE,
      quantity integer NOT NULL DEFAULT 1,
      price numeric(10,2) NOT NULL
    );
  END IF;
END $$;

-- Check and create cart_items table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cart_items') THEN
    CREATE TABLE cart_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users NOT NULL,
      product_id uuid REFERENCES products NOT NULL,
      quantity integer NOT NULL DEFAULT 1,
      created_at timestamptz DEFAULT now(),
      UNIQUE (user_id, product_id)
    );
  END IF;
END $$;

-- Check and create reviews table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
    CREATE TABLE reviews (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id uuid REFERENCES products NOT NULL,
      user_id uuid REFERENCES auth.users NOT NULL,
      rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Check and create product_images table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_images') THEN
    CREATE TABLE product_images (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id uuid REFERENCES products NOT NULL,
      image_url text NOT NULL,
      is_primary boolean DEFAULT false,
      display_order int DEFAULT 0,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create or replace function to generate a unique username
CREATE OR REPLACE FUNCTION generate_unique_username(base_username TEXT)
RETURNS TEXT AS $$
DECLARE
  new_username TEXT;
  counter INTEGER := 0;
  username_exists BOOLEAN;
BEGIN
  -- Start with the base username
  new_username := base_username;
  
  -- Check if the username exists
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM profiles WHERE username = new_username
    ) INTO username_exists;
    
    -- If username doesn't exist, return it
    IF NOT username_exists THEN
      RETURN new_username;
    END IF;
    
    -- Otherwise, append a number and try again
    counter := counter + 1;
    new_username := base_username || counter;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create or replace function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  unique_username TEXT;
BEGIN
  -- Extract username from email (part before @)
  base_username := SPLIT_PART(NEW.email, '@', 1);
  
  -- Generate a unique username
  unique_username := generate_unique_username(base_username);
  
  -- Insert a row into public.profiles
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (NEW.id, unique_username, NOW())
  ON CONFLICT (id) DO UPDATE
  SET username = EXCLUDED.username
  WHERE profiles.username IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace function to deduct stock
CREATE OR REPLACE FUNCTION deduct_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace function to get product images
CREATE OR REPLACE FUNCTION get_product_images(product_id uuid)
RETURNS TABLE (
  image_url text,
  is_primary boolean,
  display_order int
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pi.image_url,
    pi.is_primary,
    pi.display_order
  FROM 
    product_images pi
  WHERE 
    pi.product_id = $1
  ORDER BY 
    pi.is_primary DESC,
    pi.display_order ASC;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user creation if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- Create trigger for stock deduction if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'reduce_stock'
  ) THEN
    CREATE TRIGGER reduce_stock
    AFTER INSERT ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION deduct_stock();
  END IF;
END $$;

-- Create or replace product_details view
CREATE OR REPLACE VIEW product_details AS
SELECT 
  p.id,
  p.name,
  p.description,
  p.price,
  p.image_url,
  p.category,
  p.stock,
  p.created_at,
  p.category_id,
  c.name as category_name,
  c.description as category_description,
  c.image_url as category_image_url
FROM 
  products p
LEFT JOIN 
  categories c ON p.category_id = c.id;

-- Enable Row Level Security if not already enabled
DO $$ 
BEGIN
  -- For products
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'products' AND rowsecurity = true
  ) THEN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- For categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'categories' AND rowsecurity = true
  ) THEN
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- For profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND rowsecurity = true
  ) THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- For orders
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'orders' AND rowsecurity = true
  ) THEN
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- For order_items
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'order_items' AND rowsecurity = true
  ) THEN
    ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- For cart_items
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'cart_items' AND rowsecurity = true
  ) THEN
    ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- For reviews
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'reviews' AND rowsecurity = true
  ) THEN
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- For product_images
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'product_images' AND rowsecurity = true
  ) THEN
    ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies if they don't exist
DO $$ 
BEGIN
  -- For products
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Anyone can view products'
  ) THEN
    CREATE POLICY "Anyone can view products"
      ON products
      FOR SELECT
      TO public
      USING (true);
  END IF;
  
  -- For categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'categories' AND policyname = 'Anyone can view categories'
  ) THEN
    CREATE POLICY "Anyone can view categories"
      ON categories
      FOR SELECT
      TO public
      USING (true);
  END IF;
  
  -- For profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view all profiles'
  ) THEN
    CREATE POLICY "Users can view all profiles"
      ON profiles
      FOR SELECT
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
  
  -- For orders
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'orders' AND policyname = 'Users can manage their own orders'
  ) THEN
    CREATE POLICY "Users can manage their own orders"
      ON orders
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  
  -- For order_items
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'order_items' AND policyname = 'Users can view their own order items'
  ) THEN
    CREATE POLICY "Users can view their own order items"
      ON order_items
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM orders
          WHERE orders.id = order_items.order_id
          AND orders.user_id = auth.uid()
        )
      );
  END IF;
  
  -- For cart_items
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cart_items' AND policyname = 'Users can manage their own cart'
  ) THEN
    CREATE POLICY "Users can manage their own cart"
      ON cart_items
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  
  -- For reviews
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Anyone can view reviews'
  ) THEN
    CREATE POLICY "Anyone can view reviews"
      ON reviews
      FOR SELECT
      TO public
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Authenticated users can create reviews'
  ) THEN
    CREATE POLICY "Authenticated users can create reviews"
      ON reviews
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Users can update their own reviews'
  ) THEN
    CREATE POLICY "Users can update their own reviews"
      ON reviews
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Users can delete their own reviews'
  ) THEN
    CREATE POLICY "Users can delete their own reviews"
      ON reviews
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
  
  -- For product_images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_images' AND policyname = 'Anyone can view product images'
  ) THEN
    CREATE POLICY "Anyone can view product images"
      ON product_images
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Create indexes for improved performance if they don't exist
DO $$ 
BEGIN
  -- For products
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_products_category'
  ) THEN
    CREATE INDEX idx_products_category ON products(category);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_products_price'
  ) THEN
    CREATE INDEX idx_products_price ON products(price);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_products_stock'
  ) THEN
    CREATE INDEX idx_products_stock ON products(stock);
  END IF;
  
  -- For product_images
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_product_images_product_id'
  ) THEN
    CREATE INDEX idx_product_images_product_id ON product_images(product_id);
  END IF;
  
  -- For orders
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_orders_user_id'
  ) THEN
    CREATE INDEX idx_orders_user_id ON orders(user_id);
  END IF;
  
  -- For order_items
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_order_items_order_id'
  ) THEN
    CREATE INDEX idx_order_items_order_id ON order_items(order_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_order_items_product_id'
  ) THEN
    CREATE INDEX idx_order_items_product_id ON order_items(product_id);
  END IF;
  
  -- For reviews
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_reviews_product_id'
  ) THEN
    CREATE INDEX idx_reviews_product_id ON reviews(product_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_reviews_user_id'
  ) THEN
    CREATE INDEX idx_reviews_user_id ON reviews(user_id);
  END IF;
END $$;

-- Insert sample data for categories if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Electronics') THEN
    INSERT INTO categories (name, description, image_url) VALUES
    ('Electronics', 'Electronic devices and accessories', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Home & Office') THEN
    INSERT INTO categories (name, description, image_url) VALUES
    ('Home & Office', 'Products for home and office use', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Accessories') THEN
    INSERT INTO categories (name, description, image_url) VALUES
    ('Accessories', 'Fashion and personal accessories', 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd');
  END IF;
END $$;

-- Insert sample products if they don't exist
DO $$ 
BEGIN
  -- Modern Desk Lamp
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Modern Desk Lamp') THEN
    INSERT INTO products (name, description, price, image_url, category, stock, category_id) VALUES
    ('Modern Desk Lamp', 'Sleek and adjustable desk lamp perfect for any workspace', 49.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', 'Home & Office', 50, (SELECT id FROM categories WHERE name = 'Home & Office'));
  END IF;
  
  -- Wireless Earbuds
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wireless Earbuds') THEN
    INSERT INTO products (name, description, price, image_url, category, stock, category_id) VALUES
    ('Wireless Earbuds', 'High-quality wireless earbuds with noise cancellation', 129.99, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', 'Electronics', 100, (SELECT id FROM categories WHERE name = 'Electronics'));
  END IF;
  
  -- Leather Wallet
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Leather Wallet') THEN
    INSERT INTO products (name, description, price, image_url, category, stock, category_id) VALUES
    ('Leather Wallet', 'Handcrafted leather wallet with RFID protection', 79.99, 'https://images.unsplash.com/photo-1627123424574-724758594e93', 'Accessories', 75, (SELECT id FROM categories WHERE name = 'Accessories'));
  END IF;
  
  -- Smart Watch Pro
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Smart Watch Pro') THEN
    INSERT INTO products (name, description, price, image_url, category, stock, category_id) VALUES
    ('Smart Watch Pro', 'Track your fitness and stay connected with this premium smartwatch featuring heart rate monitoring, GPS, and water resistance.', 199.99, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12', 'Electronics', 35, (SELECT id FROM categories WHERE name = 'Electronics'));
  END IF;
  
  -- Ergonomic Office Chair
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ergonomic Office Chair') THEN
    INSERT INTO products (name, description, price, image_url, category, stock, category_id) VALUES
    ('Ergonomic Office Chair', 'Comfortable ergonomic chair with lumbar support, adjustable height, and breathable mesh back for long work sessions.', 249.99, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8', 'Home & Office', 20, (SELECT id FROM categories WHERE name = 'Home & Office'));
  END IF;
  
  -- Bluetooth Speaker
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bluetooth Speaker') THEN
    INSERT INTO products (name, description, price, image_url, category, stock, category_id) VALUES
    ('Bluetooth Speaker', 'Portable waterproof speaker with 20-hour battery life and immersive 360° sound for indoor and outdoor use.', 89.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', 'Electronics', 45, (SELECT id FROM categories WHERE name = 'Electronics'));
  END IF;
  
  -- Minimalist Desk Organizer
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Minimalist Desk Organizer') THEN
    INSERT INTO products (name, description, price, image_url, category, stock, category_id) VALUES
    ('Minimalist Desk Organizer', 'Keep your workspace tidy with this sleek wooden desk organizer featuring compartments for stationery and devices.', 39.99, 'https://images.unsplash.com/photo-1544816155-12df9643f363', 'Home & Office', 60, (SELECT id FROM categories WHERE name = 'Home & Office'));
  END IF;
  
  -- Leather Laptop Sleeve
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Leather Laptop Sleeve') THEN
    INSERT INTO products (name, description, price, image_url, category, stock, category_id) VALUES
    ('Leather Laptop Sleeve', 'Premium handcrafted leather sleeve that protects your laptop in style with soft microfiber interior.', 59.99, 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd', 'Accessories', 40, (SELECT id FROM categories WHERE name = 'Accessories'));
  END IF;
  
  -- Wireless Charging Pad
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wireless Charging Pad') THEN
    INSERT INTO products (name, description, price, image_url, category, stock, category_id) VALUES
    ('Wireless Charging Pad', 'Fast-charging wireless pad compatible with all Qi-enabled devices, featuring LED indicators and non-slip surface.', 34.99, 'https://images.unsplash.com/photo-1586953208448-b95a79798f07', 'Electronics', 55, (SELECT id FROM categories WHERE name = 'Electronics'));
  END IF;
  
  -- Stainless Steel Water Bottle
  IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'Stainless Steel Water Bottle') THEN
    INSERT INTO products (name, description, price, image_url, category, stock, category_id) VALUES
    ('Stainless Steel Water Bottle', 'Double-walled insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours with leak-proof design.', 29.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8', 'Accessories', 70, (SELECT id FROM categories WHERE name = 'Accessories'));
  END IF;
END $$;

-- Insert product images if they don't exist
DO $$ 
DECLARE
  p_id uuid;
BEGIN
  -- For each product, check if it has a primary image
  FOR p_id IN SELECT id FROM products LOOP
    IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = p_id AND is_primary = true) THEN
      -- Insert primary image
      INSERT INTO product_images (product_id, image_url, is_primary, display_order)
      SELECT id, image_url, true, 0
      FROM products
      WHERE id = p_id;
    END IF;
  END LOOP;
  
  -- Additional images for Modern Desk Lamp
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Modern Desk Lamp') AND 
     NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = (SELECT id FROM products WHERE name = 'Modern Desk Lamp') AND display_order = 1) THEN
    INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
    ((SELECT id FROM products WHERE name = 'Modern Desk Lamp'), 
     'https://images.unsplash.com/photo-1534281305182-f85cee241e9a', false, 1);
  END IF;
  
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Modern Desk Lamp') AND 
     NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = (SELECT id FROM products WHERE name = 'Modern Desk Lamp') AND display_order = 2) THEN
    INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
    ((SELECT id FROM products WHERE name = 'Modern Desk Lamp'), 
     'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15', false, 2);
  END IF;
  
  -- Additional images for Wireless Earbuds
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Wireless Earbuds') AND 
     NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = (SELECT id FROM products WHERE name = 'Wireless Earbuds') AND display_order = 1) THEN
    INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
    ((SELECT id FROM products WHERE name = 'Wireless Earbuds'), 
     'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37', false, 1);
  END IF;
  
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Wireless Earbuds') AND 
     NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = (SELECT id FROM products WHERE name = 'Wireless Earbuds') AND display_order = 2) THEN
    INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
    ((SELECT id FROM products WHERE name = 'Wireless Earbuds'), 
     'https://images.unsplash.com/photo-1608156639585-b3a7a6e98d0b', false, 2);
  END IF;
  
  -- Additional images for Leather Wallet
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Leather Wallet') AND 
     NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = (SELECT id FROM products WHERE name = 'Leather Wallet') AND display_order = 1) THEN
    INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
    ((SELECT id FROM products WHERE name = 'Leather Wallet'), 
     'https://images.unsplash.com/photo-1559694097-9180d94bb882', false, 1);
  END IF;
  
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Leather Wallet') AND 
     NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = (SELECT id FROM products WHERE name = 'Leather Wallet') AND display_order = 2) THEN
    INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
    ((SELECT id FROM products WHERE name = 'Leather Wallet'), 
     'https://images.unsplash.com/photo-1604026095287-95c4a6c0d1c5', false, 2);
  END IF;
  
  -- Additional images for Smart Watch Pro
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Smart Watch Pro') AND 
     NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = (SELECT id FROM products WHERE name = 'Smart Watch Pro') AND display_order = 1) THEN
    INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
    ((SELECT id FROM products WHERE name = 'Smart Watch Pro'), 
     'https://images.unsplash.com/photo-1579586337278-3befd40fd17a', false, 1);
  END IF;
  
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Smart Watch Pro') AND 
     NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = (SELECT id FROM products WHERE name = 'Smart Watch Pro') AND display_order = 2) THEN
    INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
    ((SELECT id FROM products WHERE name = 'Smart Watch Pro'), 
     'https://images.unsplash.com/photo-1523275335684-37898b6baf30', false, 2);
  END IF;
  
  -- Additional images for Stainless Steel Water Bottle
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Stainless Steel Water Bottle') AND 
     NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = (SELECT id FROM products WHERE name = 'Stainless Steel Water Bottle') AND display_order = 1) THEN
    INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
    ((SELECT id FROM products WHERE name = 'Stainless Steel Water Bottle'), 
     'https://images.unsplash.com/photo-1589365278144-c9e705f843ba', false, 1);
  END IF;
  
  IF EXISTS (SELECT 1 FROM products WHERE name = 'Stainless Steel Water Bottle') AND 
     NOT EXISTS (SELECT 1 FROM product_images WHERE product_images.product_id = (SELECT id FROM products WHERE name = 'Stainless Steel Water Bottle') AND display_order = 2) THEN
    INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
    ((SELECT id FROM products WHERE name = 'Stainless Steel Water Bottle'), 
     'https://images.unsplash.com/photo-1610824352934-c10d87b700cc', false, 2);
  END IF;
END $$;

COMMIT;