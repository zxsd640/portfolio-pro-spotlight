
-- 1) Remove email exposure from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE base TEXT; candidate TEXT; n INT := 0;
BEGIN
  base := lower(regexp_replace(coalesce(split_part(NEW.email,'@',1), 'user'), '[^a-z0-9]+', '', 'g'));
  IF base = '' OR base IS NULL THEN base := 'user'; END IF;
  candidate := base;
  WHILE EXISTS(SELECT 1 FROM public.profiles WHERE username = candidate) LOOP
    n := n + 1;
    candidate := base || n::text;
  END LOOP;
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (NEW.id, candidate, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', candidate));
  RETURN NEW;
END; $function$;

-- 2) Restrict portfolio_likes to authenticated users who own their like
DROP POLICY IF EXISTS "Anyone can like" ON public.portfolio_likes;
DROP POLICY IF EXISTS "Anyone can unlike with same hash" ON public.portfolio_likes;

CREATE POLICY "Authenticated users can like"
  ON public.portfolio_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (visitor_hash = auth.uid()::text AND profile_id IS NOT NULL);

CREATE POLICY "Users can remove their own like"
  ON public.portfolio_likes
  FOR DELETE
  TO authenticated
  USING (visitor_hash = auth.uid()::text);

-- 3) Tighten portfolio_views INSERT check
DROP POLICY IF EXISTS "Anyone can insert a view" ON public.portfolio_views;

CREATE POLICY "Anyone can insert a view"
  ON public.portfolio_views
  FOR INSERT
  WITH CHECK (
    profile_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_id AND p.published = true)
    AND (visitor_hash IS NULL OR char_length(visitor_hash) BETWEEN 8 AND 128)
    AND (referrer IS NULL OR char_length(referrer) <= 500)
  );
