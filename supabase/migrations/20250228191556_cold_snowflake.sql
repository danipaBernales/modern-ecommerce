-- Add foreign key constraint to reviews table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'reviews_user_id_fkey' 
    AND table_name = 'reviews'
  ) THEN
    ALTER TABLE reviews 
    ADD CONSTRAINT reviews_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id);
  END IF;
END $$;
