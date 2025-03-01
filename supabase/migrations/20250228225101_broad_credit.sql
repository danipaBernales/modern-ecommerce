-- Clean duplicate products if exists
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

-- Ensure unique constraint on products
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_product_name_category'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT unique_product_name_category UNIQUE (name, category);
  END IF;
END $$;

-- Ensure all products have a category_id if categories table exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'categories'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    -- Update any products that might not have a category_id
    UPDATE products
    SET category_id = categories.id
    FROM categories
    WHERE products.category = categories.name
    AND products.category_id IS NULL;
  END IF;
END $$;

-- Verify all product_images have valid product references
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'product_images'
  ) THEN
    -- Delete any orphaned product images
    DELETE FROM product_images
    WHERE NOT EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_images.product_id
    );
  END IF;
END $$;

-- Verify all reviews have valid product references
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'reviews'
  ) THEN
    -- Delete any orphaned reviews
    DELETE FROM reviews
    WHERE NOT EXISTS (
      SELECT 1 FROM products
      WHERE products.id = reviews.product_id
    );
  END IF;
END $$;
