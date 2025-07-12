-- Check and fix policies for subscription_plans table
-- This script safely handles existing policies

-- Check if the public read policy exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscription_plans' 
        AND policyname = 'Allow public read-only access to active plans'
    ) THEN
        CREATE POLICY "Allow public read-only access to active plans" ON subscription_plans
        FOR SELECT USING (is_active = true);
    END IF;
END$$;

-- Check if the admin policy exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscription_plans' 
        AND policyname = 'Allow admin full access'
    ) THEN
        CREATE POLICY "Allow admin full access" ON subscription_plans
        FOR ALL USING (true);
    END IF;
END$$;

-- Verify policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'subscription_plans'; 