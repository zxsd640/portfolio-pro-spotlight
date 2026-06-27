
-- portfolio_likes: remove public readability
DROP POLICY IF EXISTS "Anyone can read likes" ON public.portfolio_likes;

CREATE POLICY "Profile owner can read likes"
  ON public.portfolio_likes FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "User can read own like"
  ON public.portfolio_likes FOR SELECT
  TO authenticated
  USING (visitor_hash = (auth.uid())::text);

-- Public count helper (no row data exposed)
CREATE OR REPLACE FUNCTION public.get_portfolio_likes_count(_profile_id uuid)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::bigint
  FROM public.portfolio_likes pl
  WHERE pl.profile_id = _profile_id
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = _profile_id AND p.published = true
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_portfolio_likes_count(uuid) TO anon, authenticated;

-- Public helper to check if current user liked a profile
CREATE OR REPLACE FUNCTION public.has_liked_portfolio(_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.portfolio_likes
    WHERE profile_id = _profile_id
      AND visitor_hash = (auth.uid())::text
  );
$$;

GRANT EXECUTE ON FUNCTION public.has_liked_portfolio(uuid) TO authenticated;

-- Storage: tighten portfolio-assets reads
DROP POLICY IF EXISTS "Anon can read portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can read portfolio assets" ON storage.objects;

CREATE POLICY "Owner can read own portfolio assets"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'portfolio-assets'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

CREATE POLICY "Anyone can read assets of published profiles"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'portfolio-assets'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id::text = (storage.foldername(name))[1]
        AND p.published = true
    )
  );
