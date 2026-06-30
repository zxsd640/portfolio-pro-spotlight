
CREATE TABLE public.prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  body text NOT NULL,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompts TO authenticated;
GRANT SELECT ON public.prompts TO anon;
GRANT ALL ON public.prompts TO service_role;

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage prompts"
  ON public.prompts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can read prompts of published profiles"
  ON public.prompts FOR SELECT
  TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = user_id AND p.published = true));

CREATE TRIGGER prompts_touch_updated
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX prompts_user_id_idx ON public.prompts(user_id);
