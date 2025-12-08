-- Supprimer les contraintes de clés étrangères pour permettre les interactions avec les radios externes
ALTER TABLE public.radio_reactions 
DROP CONSTRAINT IF EXISTS radio_reactions_radio_id_fkey;

ALTER TABLE public.radio_comments 
DROP CONSTRAINT IF EXISTS radio_comments_radio_id_fkey;

ALTER TABLE public.live_comments 
DROP CONSTRAINT IF EXISTS live_comments_radio_id_fkey;

-- Changer le type de radio_id de UUID à TEXT pour supporter les IDs de radios externes
ALTER TABLE public.radio_reactions 
ALTER COLUMN radio_id TYPE TEXT USING radio_id::TEXT;

ALTER TABLE public.radio_comments 
ALTER COLUMN radio_id TYPE TEXT USING radio_id::TEXT;

ALTER TABLE public.live_comments 
ALTER COLUMN radio_id TYPE TEXT USING radio_id::TEXT;