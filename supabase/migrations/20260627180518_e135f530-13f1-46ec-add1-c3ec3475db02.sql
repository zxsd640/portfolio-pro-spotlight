
CREATE POLICY "Users can upload own folder" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own folder" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own folder" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Authenticated can read portfolio assets" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Anon can read portfolio assets" ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'portfolio-assets');
