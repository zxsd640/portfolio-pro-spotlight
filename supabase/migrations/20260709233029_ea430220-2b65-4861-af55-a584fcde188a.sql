
-- 1) Add public read policy on portfolio_likes so like counts are readable without SECURITY DEFINER
CREATE POLICY "Public can read likes for published portfolios"
  ON public.portfolio_likes
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = portfolio_likes.profile_id AND p.published = true
    )
  );

-- 2) Enforce visitor_hash format so it cannot be spoofed to collide with another auth.uid()
ALTER TABLE public.portfolio_likes
  ADD CONSTRAINT portfolio_likes_visitor_hash_uuid_format
  CHECK (visitor_hash ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

-- 3) Convert SECURITY DEFINER functions to SECURITY INVOKER (RLS now allows the reads)
CREATE OR REPLACE FUNCTION public.get_portfolio_likes_count(_profile_id uuid)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT count(*)::bigint
  FROM public.portfolio_likes pl
  WHERE pl.profile_id = _profile_id;
$$;

CREATE OR REPLACE FUNCTION public.has_liked_portfolio(_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.portfolio_likes
    WHERE profile_id = _profile_id
      AND visitor_hash = (auth.uid())::text
  );
$$;

-- Restrict execute: anon can only read counts (needed for public portfolio pages); has_liked requires auth
REVOKE ALL ON FUNCTION public.get_portfolio_likes_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_portfolio_likes_count(uuid) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.has_liked_portfolio(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_liked_portfolio(uuid) TO authenticated;

-- 4) Portfolio owners can delete/update their own collected analytics rows
CREATE POLICY "Owner can delete own views"
  ON public.portfolio_views
  FOR DELETE
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "Owner can update own views"
  ON public.portfolio_views
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);
