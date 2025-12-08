import { supabase } from '@/integrations/supabase/client';

export interface RadioReaction {
  id: string;
  radio_id: string; // TEXT - peut être un UUID Supabase ou un stationuuid externe
  user_id: string;
  reaction_type: 'like' | 'dislike';
  created_at: string;
}

export interface RadioComment {
  id: string;
  radio_id: string; // TEXT - peut être un UUID Supabase ou un stationuuid externe
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_display_name?: string;
  user_avatar_url?: string;
}

export interface LiveComment {
  id: string;
  radio_id: string; // TEXT - peut être un UUID Supabase ou un stationuuid externe
  user_id: string;
  content: string;
  is_dedication: boolean;
  dedication_to?: string;
  created_at: string;
  user_display_name?: string;
  user_avatar_url?: string;
}

// ============ REACTIONS ============

export async function addReaction(radioId: string, reactionType: 'like' | 'dislike'): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Vous devez être connecté pour réagir');
  }

  // Vérifier si l'utilisateur a déjà une réaction
  const { data: existingReaction } = await supabase
    .from('radio_reactions')
    .select('id, reaction_type')
    .eq('radio_id', radioId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingReaction) {
    if (existingReaction.reaction_type === reactionType) {
      // Même réaction, on la supprime (toggle)
      await supabase
        .from('radio_reactions')
        .delete()
        .eq('id', existingReaction.id);
    } else {
      // Réaction différente, on la met à jour
      await supabase
        .from('radio_reactions')
        .update({ reaction_type: reactionType })
        .eq('id', existingReaction.id);
    }
  } else {
    // Nouvelle réaction
    const { error } = await supabase
      .from('radio_reactions')
      .insert({
        radio_id: radioId,
        user_id: user.id,
        reaction_type: reactionType
      });

    if (error) throw error;
  }
}

export async function getReactionCounts(radioId: string): Promise<{ likes: number; dislikes: number }> {
  const { data, error } = await supabase
    .from('radio_reactions')
    .select('reaction_type')
    .eq('radio_id', radioId);

  if (error) throw error;

  const likes = data?.filter(r => r.reaction_type === 'like').length || 0;
  const dislikes = data?.filter(r => r.reaction_type === 'dislike').length || 0;

  return { likes, dislikes };
}

export async function getUserReaction(radioId: string): Promise<'like' | 'dislike' | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('radio_reactions')
    .select('reaction_type')
    .eq('radio_id', radioId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return null;

  return data.reaction_type as 'like' | 'dislike';
}

// ============ COMMENTS ============

export async function addComment(radioId: string, content: string): Promise<RadioComment> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Vous devez être connecté pour commenter');
  }

  const { data, error } = await supabase
    .from('radio_comments')
    .insert({
      radio_id: radioId,
      user_id: user.id,
      content: content.trim()
    })
    .select('*')
    .single();

  if (error) throw error;

  return data;
}

export async function getComments(radioId: string): Promise<RadioComment[]> {
  const { data: comments, error } = await supabase
    .from('radio_comments')
    .select('*')
    .eq('radio_id', radioId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Récupérer les infos des utilisateurs
  const userIds = [...new Set(comments?.map(c => c.user_id) || [])];
  
  if (userIds.length === 0) return [];

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  return (comments || []).map(comment => ({
    ...comment,
    user_display_name: profileMap.get(comment.user_id)?.display_name || 'Anonyme',
    user_avatar_url: profileMap.get(comment.user_id)?.avatar_url || undefined
  }));
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('radio_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}

// ============ LIVE COMMENTS / DEDICATIONS ============

export async function addLiveComment(
  radioId: string, 
  content: string, 
  isDedication: boolean = false, 
  dedicationTo?: string
): Promise<LiveComment> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Vous devez être connecté pour commenter');
  }

  const { data, error } = await supabase
    .from('live_comments')
    .insert({
      radio_id: radioId,
      user_id: user.id,
      content: content.trim(),
      is_dedication: isDedication,
      dedication_to: dedicationTo?.trim() || null
    })
    .select('*')
    .single();

  if (error) throw error;

  return data;
}

export async function getLiveComments(radioId: string, limit: number = 50): Promise<LiveComment[]> {
  const { data: comments, error } = await supabase
    .from('live_comments')
    .select('*')
    .eq('radio_id', radioId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  // Récupérer les infos des utilisateurs
  const userIds = [...new Set(comments?.map(c => c.user_id) || [])];
  
  if (userIds.length === 0) return [];

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', userIds);

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  return (comments || []).map(comment => ({
    ...comment,
    user_display_name: profileMap.get(comment.user_id)?.display_name || 'Anonyme',
    user_avatar_url: profileMap.get(comment.user_id)?.avatar_url || undefined
  }));
}

export async function deleteLiveComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('live_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}

// Subscribe to live comments realtime
export function subscribeLiveComments(
  radioId: string, 
  onNewComment: (comment: LiveComment) => void
) {
  return supabase
    .channel(`live-comments-${radioId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'live_comments',
        filter: `radio_id=eq.${radioId}`
      },
      async (payload) => {
        const comment = payload.new as LiveComment;
        
        // Fetch user info
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', comment.user_id)
          .single();

        onNewComment({
          ...comment,
          user_display_name: profile?.display_name || 'Anonyme',
          user_avatar_url: profile?.avatar_url || undefined
        });
      }
    )
    .subscribe();
}
