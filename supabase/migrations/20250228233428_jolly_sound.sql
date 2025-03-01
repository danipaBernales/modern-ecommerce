/*
  # Add username to profiles table

  1. Changes
    - Adds username column to profiles table if it exists
    - Creates profiles table with username column if it doesn't exist
    - Updates existing profiles to have a username based on email
    - Makes username required and unique
*/

-- First check if profiles table exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    -- Create profiles table if it doesn't exist
    CREATE TABLE profiles (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      full_name text,
      address text,
      phone text,
      username text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
    
    -- Enable RLS on profiles
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for profiles
    CREATE POLICY "Users can manage their own profile"
      ON profiles
      FOR ALL
      TO authenticated
      USING (auth.uid() = id);
  ELSE
    -- Add username column if the table exists but column doesn't
    IF NOT EXISTS (
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
  END IF;
  
  -- Create a unique index on username (works whether we just created the table or added the column)
  CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
END $$;

-- Add comment to explain the column
COMMENT ON COLUMN profiles.username IS 'Unique username for the user, displayed in the UI';