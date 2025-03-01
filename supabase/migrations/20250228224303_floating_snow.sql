/*
  # Product Categories and Schema Improvements

  1. New Tables
    - `categories` - Dedicated table for product categories
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    - `product_images` - Multiple images per product
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `image_url` (text)
      - `is_primary` (boolean)
      - `display_order` (integer)
      - `created_at` (timestamp)

  2. Schema Improvements
    - Add foreign key from products to categories
    - Add unique constraint to prevent duplicate product insertions
    - Add indexes for improved query performance
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for categories
CREATE POLICY "Anyone can view categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Create product_images table for multiple images per product
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products NOT NULL,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on product_images
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policy for product_images
CREATE POLICY "Anyone can view product images"
  ON product_images
  FOR SELECT
  TO public
  USING (true);

-- Add indexes for improved performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- First, remove duplicate products to avoid constraint violation
-- This approach doesn't use MIN() on UUID which was causing the error
DO $$
DECLARE
  r RECORD;
  duplicate_exists BOOLEAN;
BEGIN
  -- Find all distinct name/category combinations
  FOR r IN 
    SELECT name, category FROM products
    GROUP BY name, category
  LOOP
    -- Check if there are duplicates for this name/category
    SELECT COUNT(*) > 1 INTO duplicate_exists
    FROM products
    WHERE name = r.name AND category = r.category;
    
    -- If duplicates exist, keep only the first one (by ID)
    IF duplicate_exists THEN
      -- Delete all but the first record (ordered by ID)
      DELETE FROM products 
      WHERE name = r.name 
        AND category = r.category 
        AND id NOT IN (
          SELECT id FROM products 
          WHERE name = r.name AND category = r.category 
          ORDER BY id 
          LIMIT 1
        );
    END IF;
  END LOOP;
END $$;

-- Extract unique categories from products and insert into categories table
INSERT INTO categories (name, description, image_url)
SELECT DISTINCT 
  category, 
  'Products in the ' || category || ' category', 
  CASE 
    WHEN category = 'Electronics' THEN 'https://images.unsplash.com/photo-1546868871-7041f2a55e12'
    WHEN category = 'Home & Office' THEN 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8'
    WHEN category = 'Accessories' THEN 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd'
    ELSE 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
  END
FROM products
ON CONFLICT (name) DO NOTHING;

-- Add category_id column to products table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE products ADD COLUMN category_id uuid REFERENCES categories(id);
  END IF;
END $$;

-- Update products to reference category_id
UPDATE products
SET category_id = categories.id
FROM categories
WHERE products.category = categories.name;

-- Now it's safe to add the unique constraint
ALTER TABLE products ADD CONSTRAINT unique_product_name_category UNIQUE (name, category);

-- Migrate primary product images to product_images table
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
SELECT id, image_url, true, 0
FROM products
WHERE image_url IS NOT NULL
ON CONFLICT DO NOTHING;

-- Add additional product images for some products
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
VALUES
  -- Additional images for Modern Desk Lamp
  ((SELECT id FROM products WHERE name = 'Modern Desk Lamp' LIMIT 1), 
   'https://images.unsplash.com/photo-1534281305182-f85cee241e9a', false, 1),
  ((SELECT id FROM products WHERE name = 'Modern Desk Lamp' LIMIT 1), 
   'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15', false, 2),
   
  -- Additional images for Wireless Earbuds
  ((SELECT id FROM products WHERE name = 'Wireless Earbuds' LIMIT 1), 
   'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37', false, 1),
  ((SELECT id FROM products WHERE name = 'Wireless Earbuds' LIMIT 1), 
   'https://images.unsplash.com/photo-1608156639585-b3a7a6e98d0b', false, 2),
   
  -- Additional images for Leather Wallet
  ((SELECT id FROM products WHERE name = 'Leather Wallet' LIMIT 1), 
   'https://images.unsplash.com/photo-1559694097-9180d94bb882', false, 1),
  ((SELECT id FROM products WHERE name = 'Leather Wallet' LIMIT 1), 
   'https://images.unsplash.com/photo-1604026095287-95c4a6c0d1c5', false, 2),
   
  -- Additional images for Smart Watch Pro
  ((SELECT id FROM products WHERE name = 'Smart Watch Pro' LIMIT 1), 
   'https://images.unsplash.com/photo-1579586337278-3befd40fd17a', false, 1),
  ((SELECT id FROM products WHERE name = 'Smart Watch Pro' LIMIT 1), 
   'https://images.unsplash.com/photo-1523275335684-37898b6baf30', false, 2),
   
  -- Additional images for Stainless Steel Water Bottle
  ((SELECT id FROM products WHERE name = 'Stainless Steel Water Bottle' LIMIT 1), 
   'https://images.unsplash.com/photo-1589365278144-c9e705f843ba', false, 1),
  ((SELECT id FROM products WHERE name = 'Stainless Steel Water Bottle' LIMIT 1), 
   'https://images.unsplash.com/photo-1610824352934-c10d87b700cc', false, 2)
ON CONFLICT DO NOTHING;

-- Create function to get all images for a product
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

-- Create a view for products with their category information
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