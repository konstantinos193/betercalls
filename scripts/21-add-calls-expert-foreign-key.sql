-- Add foreign key constraint between calls and experts tables
-- This migration ensures the calls.expert_id references experts.id

-- First, check if the foreign key already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'calls_expert_id_fkey' 
        AND table_name = 'calls'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE calls 
        ADD CONSTRAINT calls_expert_id_fkey 
        FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE SET NULL;
        
        RAISE NOTICE 'Foreign key constraint calls_expert_id_fkey added successfully';
    ELSE
        RAISE NOTICE 'Foreign key constraint calls_expert_id_fkey already exists';
    END IF;
END $$;

-- Create an index on expert_id for better performance
CREATE INDEX IF NOT EXISTS idx_calls_expert_id ON calls(expert_id);

-- Verify the relationship
SELECT 
    'Foreign key verification' as status,
    COUNT(*) as total_calls,
    COUNT(CASE WHEN expert_id IS NOT NULL THEN 1 END) as calls_with_expert,
    COUNT(CASE WHEN expert_id IS NULL THEN 1 END) as calls_without_expert
FROM calls; 