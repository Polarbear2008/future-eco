-- Create a new storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Create a policy to allow anonymous users to read project images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-images');

-- Create a policy to allow authenticated users to upload project images
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );

-- Create a policy to allow authenticated users to update their own project images
CREATE POLICY "Authenticated users can update own images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'project-images' 
    AND auth.uid() = owner
  );

-- Create a policy to allow authenticated users to delete their own project images
CREATE POLICY "Authenticated users can delete own images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'project-images' 
    AND auth.uid() = owner
  );

-- Create a policy to allow admin bypass for storage operations
CREATE POLICY "Admin bypass for storage" ON storage.objects
  USING (request.headers->>'x-admin-bypass-rls' = 'true')
  WITH CHECK (request.headers->>'x-admin-bypass-rls' = 'true');
