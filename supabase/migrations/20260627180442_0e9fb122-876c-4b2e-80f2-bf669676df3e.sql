
-- PROFILES
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  email TEXT,
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark','light')),
  accent TEXT NOT NULL DEFAULT 'violet',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid()=id) WITH CHECK (auth.uid()=id);
CREATE POLICY "Public can view published profiles" ON public.profiles FOR SELECT TO anon, authenticated USING (published = true OR auth.uid()=id);

-- PROJECTS
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO anon;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages own projects" ON public.projects FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "Public can view projects of published profiles" ON public.projects FOR SELECT TO anon, authenticated USING (EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=user_id AND (p.published=true OR p.id=auth.uid())));

-- SKILLS
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INT NOT NULL DEFAULT 80 CHECK (level BETWEEN 0 AND 100),
  category TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT SELECT ON public.skills TO anon;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages own skills" ON public.skills FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "Public can view skills of published profiles" ON public.skills FOR SELECT TO anon, authenticated USING (EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=user_id AND (p.published=true OR p.id=auth.uid())));

-- EXPERIENCE
CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL,
  company TEXT,
  start_date TEXT,
  end_date TEXT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experience TO authenticated;
GRANT SELECT ON public.experience TO anon;
GRANT ALL ON public.experience TO service_role;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages own experience" ON public.experience FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "Public can view experience of published profiles" ON public.experience FOR SELECT TO anon, authenticated USING (EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=user_id AND (p.published=true OR p.id=auth.uid())));

-- ACHIEVEMENTS
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT SELECT ON public.achievements TO anon;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages own achievements" ON public.achievements FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "Public can view achievements of published profiles" ON public.achievements FOR SELECT TO anon, authenticated USING (EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=user_id AND (p.published=true OR p.id=auth.uid())));

-- SOCIAL LINKS
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT SELECT ON public.social_links TO anon;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages own socials" ON public.social_links FOR ALL TO authenticated USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "Public can view socials of published profiles" ON public.social_links FOR SELECT TO anon, authenticated USING (EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=user_id AND (p.published=true OR p.id=auth.uid())));

-- VIEWS (anonymous can insert; owner can read)
CREATE TABLE public.portfolio_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  referrer TEXT,
  visitor_hash TEXT
);
GRANT SELECT, INSERT ON public.portfolio_views TO authenticated;
GRANT INSERT ON public.portfolio_views TO anon;
GRANT ALL ON public.portfolio_views TO service_role;
ALTER TABLE public.portfolio_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert a view" ON public.portfolio_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Owner can read own views" ON public.portfolio_views FOR SELECT TO authenticated USING (auth.uid()=profile_id);

-- LIKES
CREATE TABLE public.portfolio_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  visitor_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, visitor_hash)
);
GRANT SELECT, INSERT, DELETE ON public.portfolio_likes TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.portfolio_likes TO anon;
GRANT ALL ON public.portfolio_likes TO service_role;
ALTER TABLE public.portfolio_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can like" ON public.portfolio_likes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read likes" ON public.portfolio_likes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can unlike with same hash" ON public.portfolio_likes FOR DELETE TO anon, authenticated USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path=public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE base TEXT; candidate TEXT; n INT := 0;
BEGIN
  base := lower(regexp_replace(coalesce(split_part(NEW.email,'@',1), 'user'), '[^a-z0-9]+', '', 'g'));
  IF base = '' OR base IS NULL THEN base := 'user'; END IF;
  candidate := base;
  WHILE EXISTS(SELECT 1 FROM public.profiles WHERE username = candidate) LOOP
    n := n + 1;
    candidate := base || n::text;
  END LOOP;
  INSERT INTO public.profiles (id, username, display_name, email)
  VALUES (NEW.id, candidate, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', candidate), NEW.email);
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
