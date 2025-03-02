# Database Migration Guide

This guide provides best practices for managing database migrations in the ModernShop project.

## Best Practices for Future Migrations

### 1. Check Existing Schema First

Before creating a new migration:
- Review the current schema documentation
- Check existing migration files for similar operations
- Use `\d table_name` in psql to inspect table structure

### 2. Use Descriptive Names

Name migration files clearly to indicate their purpose:
- `create_products_table.sql`
- `add_username_to_profiles.sql`
- `create_order_status_enum.sql`

### 3. Document Your Migrations

Include a comment block at the top of each migration file:

```sql
/*
  # Add username to profiles table

  This migration:
  1. Adds a username column to the profiles table
  2. Makes the column required (NOT NULL)
  3. Creates a unique index on the username column
  4. Updates existing profiles with a username based on their email
*/
```

### 4. Make Migrations Idempotent

Use conditional statements to ensure migrations can be run multiple times without errors:

```sql
-- Add column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles ADD COLUMN username TEXT;
  END IF;
END $$;
```

### 5. Test Migrations Before Applying

Always test migrations in a development environment:
- Create a test database with the current schema
- Apply the migration and verify it works as expected
- Check for any unintended side effects

### 6. Use Transactions

Wrap complex migrations in transactions to ensure atomicity:

```sql
BEGIN;

-- Migration operations here

COMMIT;
```

### 7. Consider Data Migration Separately

Split schema changes and data migrations into separate files:
- First migration: Change the schema
- Second migration: Migrate the data

### 8. Avoid Modifying Existing Migrations

Once a migration has been applied to any environment:
- Never modify it
- Create a new migration to fix any issues
- Document the relationship between the migrations

## Migration Review Process

Before merging a new migration:
1. Have another developer review the migration
2. Test the migration in a staging environment
3. Document any special considerations or dependencies
4. Update the schema documentation

## Handling the Current Situation

Since we already have multiple overlapping migrations:

1. **Do not delete or modify existing migrations** that have been applied
2. Create a consolidated schema documentation (see DATABASE_SCHEMA.md)
3. For future changes, follow the best practices above
4. Consider creating a "baseline" migration for new environments

By following these guidelines, we can maintain a more manageable migration history going forward.