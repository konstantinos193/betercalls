-- Clean up invalid expert_id references in calls table
-- This migration removes any calls that reference non-existent experts

-- First check if experts table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'experts') THEN
        -- First, identify calls with invalid expert_id references
        WITH invalid_calls AS (
            SELECT c.id, c.expert_id
            FROM calls c
            LEFT JOIN experts e ON c.expert_id = e.id
            WHERE c.expert_id IS NOT NULL AND e.id IS NULL
        )
        SELECT 
            'Invalid expert references found' as status,
            COUNT(*) as invalid_calls_count
        FROM invalid_calls;

        -- Update calls with invalid expert_id to NULL
        UPDATE calls 
        SET expert_id = NULL 
        WHERE expert_id IS NOT NULL 
        AND expert_id NOT IN (SELECT id FROM experts);

        -- Verify cleanup
        SELECT 
            'Cleanup verification' as status,
            COUNT(*) as total_calls,
            COUNT(CASE WHEN expert_id IS NOT NULL THEN 1 END) as calls_with_valid_expert,
            COUNT(CASE WHEN expert_id IS NULL THEN 1 END) as calls_without_expert
        FROM calls;
    ELSE
        RAISE NOTICE 'Experts table does not exist yet. Skipping cleanup.';
    END IF;
END $$;