-- Check if profiles table exists and has username column
DO $$ 
BEGIN
  -- Add username column if it doesn't exist
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'profiles'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles ADD COLUMN username TEXT;
    
    -- Update existing profiles to have a username based on email
    UPDATE profiles
    SET username = SPLIT_PART(auth.users.email, '@', 1)
    FROM auth.users
    WHERE profiles.id = auth.users.id
    AND profiles.username IS NULL;
    
    -- Make username required after updating existing records
    ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;
  END IF;
  
  -- Create a unique index on username if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'profiles_username_idx'
  ) THEN
    CREATE UNIQUE INDEX profiles_username_idx ON profiles(username);
  END IF;
END $$;

-- Create a function to generate a unique username
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

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  unique_username TEXT;
BEGIN
  -- Extract username from email
  base_username := SPLIT_PART(NEW.email, '@', 1);
  
  -- Generate a unique username
  unique_username := generate_unique_username(base_username);
  
  -- Insert a row into public.profiles
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (NEW.id, unique_username, NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the trigger already exists and create it if it doesn't
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

-- Add RLS policies for profiles if they don't exist
DO $$
BEGIN
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
END $$;
