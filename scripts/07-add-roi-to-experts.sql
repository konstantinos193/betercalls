-- Add a column to store the calculated ROI for each expert
ALTER TABLE experts
ADD COLUMN IF NOT EXISTS roi NUMERIC(10, 2) DEFAULT 0;
