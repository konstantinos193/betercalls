-- Create a new public storage bucket for avatars.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for the new bucket.
-- Allow authenticated users to upload an avatar.
CREATE POLICY "Allow authenticated users to upload an avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid);

-- Allow users to update their own avatar.
CREATE POLICY "Allow users to update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid);

-- Allow users to view their own avatar (and public ones).
CREATE POLICY "Allow users to view their own avatar"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid);
