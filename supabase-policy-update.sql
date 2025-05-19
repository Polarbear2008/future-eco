-- Update the RLS policy to ensure only authenticated users can create projects
-- This is the secure configuration for production use

-- Drop the existing policy for insert
DROP POLICY IF EXISTS "Allow insert for testing" ON projects;

-- Create a proper policy that only allows authenticated users to insert
CREATE POLICY "Allow authenticated insert only" 
ON projects
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add policies for other operations to ensure proper security

-- Read policy - Allow anyone to read projects
CREATE POLICY IF NOT EXISTS "Allow public read" 
ON projects
FOR SELECT
TO anon, authenticated
USING (true);

-- Update policy - Only authenticated users can update their own projects
CREATE POLICY IF NOT EXISTS "Allow authenticated update" 
ON projects
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Delete policy - Only authenticated users can delete their own projects
CREATE POLICY IF NOT EXISTS "Allow authenticated delete" 
ON projects
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);
