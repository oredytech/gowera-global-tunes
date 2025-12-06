-- Table pour les likes/dislikes sur les radios
CREATE TABLE public.radio_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  radio_id UUID NOT NULL REFERENCES public.radio_suggestions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(radio_id, user_id)
);

-- Table pour les commentaires sur les radios
CREATE TABLE public.radio_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  radio_id UUID NOT NULL REFERENCES public.radio_suggestions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les commentaires live / dédicaces
CREATE TABLE public.live_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  radio_id UUID NOT NULL REFERENCES public.radio_suggestions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_dedication BOOLEAN DEFAULT false,
  dedication_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.radio_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_comments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour radio_reactions
CREATE POLICY "Anyone can view reactions" ON public.radio_reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add reactions" ON public.radio_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reactions" ON public.radio_reactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON public.radio_reactions FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour radio_comments
CREATE POLICY "Anyone can view comments" ON public.radio_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add comments" ON public.radio_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.radio_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.radio_comments FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour live_comments
CREATE POLICY "Anyone can view live comments" ON public.live_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add live comments" ON public.live_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own live comments" ON public.live_comments FOR DELETE USING (auth.uid() = user_id);

-- Activer realtime pour les commentaires live
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_comments;

-- Trigger pour mettre à jour updated_at sur radio_comments
CREATE TRIGGER update_radio_comments_updated_at
  BEFORE UPDATE ON public.radio_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();