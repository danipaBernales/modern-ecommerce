-- Function to generate a unique username
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

-- Create a function to handle new user creation
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
  VALUES (NEW.id, unique_username, NOW())
  ON CONFLICT (id) DO UPDATE
  SET username = EXCLUDED.username
  WHERE profiles.username IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Update existing users without a profile
DO $$
DECLARE
  r RECORD;
  base_username TEXT;
  unique_username TEXT;
BEGIN
  FOR r IN 
    SELECT id, email FROM auth.users
    WHERE NOT EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.users.id
    )
  LOOP
    -- Extract username from email
    base_username := SPLIT_PART(r.email, '@', 1);
    
    -- Generate a unique username
    unique_username := generate_unique_username(base_username);
    
    -- Insert profile
    INSERT INTO profiles (id, username, created_at)
    VALUES (r.id, unique_username, NOW())
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;

-- Make sure all profiles have a username
UPDATE profiles
SET username = generate_unique_username(SPLIT_PART(auth.users.email, '@', 1))
FROM auth.users
WHERE profiles.id = auth.users.id
AND (profiles.username IS NULL OR profiles.username = '');

-- RLS policies for profiles if they don't exist
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
