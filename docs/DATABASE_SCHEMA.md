# ModernShop Database Schema

This document provides an overview of the current database schema for the ModernShop application.

## Tables

### Products
```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  category text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES categories(id),
  CONSTRAINT unique_product_name_category UNIQUE (name, category)
);
```

### Categories
```sql
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);
```

### Profiles
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  address text,
  phone text,
  username text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT profiles_username_key UNIQUE (username)
);
```

### Orders
```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  total_price numeric(10,2) NOT NULL,
  status text CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

### Order Items
```sql
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders ON DELETE CASCADE,
  product_id uuid REFERENCES products ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL
);
```

### Cart Items
```sql
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, product_id)
);
```

### Reviews
```sql
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

### Product Images
```sql
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products NOT NULL,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

## Views

### Product Details
```sql
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
```

## Functions

### Generate Unique Username
```sql
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
```

### Handle New User
```sql
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
```

### Get Product Images
```sql
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
```

## Triggers

### On Auth User Created
```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
```

### Reduce Stock
```sql
CREATE TRIGGER reduce_stock
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION deduct_stock();
```

## Row Level Security (RLS)

All tables have Row Level Security enabled with appropriate policies:

- Products: Anyone can view
- Profiles: Users can view all, but only update their own
- Orders: Users can manage their own orders
- Cart Items: Users can manage their own cart
- Reviews: Anyone can view, authenticated users can create, users can update/delete their own
- Categories: Anyone can view
- Product Images: Anyone can view

## Migration Best Practices

For future migrations:

1. **Check existing schema** before creating new migrations
2. **Use descriptive names** for migration files
3. **Include comments** explaining the purpose of each migration
4. **Test migrations** in a development environment before applying to production
5. **Use IF EXISTS/IF NOT EXISTS** clauses to make migrations idempotent
6. **Avoid duplicating** operations from previous migrations