-- SQL commands to set up proper RLS policies for volunteers table
-- Run these in the Supabase SQL Editor

-- First, enable RLS on the volunteers table (if not already enabled)
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies (optional)
DROP POLICY IF EXISTS "Allow public read access" ON volunteers;
DROP POLICY IF EXISTS "Allow authenticated insert" ON volunteers;
DROP POLICY IF EXISTS "Allow public insert access" ON volunteers;

-- Create a policy that allows anyone to read volunteer records
CREATE POLICY "Allow public read access"
ON volunteers
FOR SELECT
USING (true);

-- Create a policy that allows anyone to insert new volunteer applications
-- This is what will fix your form submission issue
CREATE POLICY "Allow public insert access"
ON volunteers
FOR INSERT
WITH CHECK (true);

-- Create a policy that only allows authenticated users to update/delete records
CREATE POLICY "Allow authenticated update and delete"
ON volunteers
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete"
ON volunteers
FOR DELETE USING (auth.role() = 'authenticated');
