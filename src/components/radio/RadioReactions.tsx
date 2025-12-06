import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { addReaction, getReactionCounts, getUserReaction } from '@/services/supabase/radioInteractionService';

interface RadioReactionsProps {
  radioId: string;
}

export function RadioReactions({ radioId }: RadioReactionsProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReactions();
  }, [radioId]);

  const loadReactions = async () => {
    try {
      const counts = await getReactionCounts(radioId);
      setLikes(counts.likes);
      setDislikes(counts.dislikes);
      
      if (currentUser) {
        const reaction = await getUserReaction(radioId);
        setUserReaction(reaction);
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!currentUser) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour réagir",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await addReaction(radioId, type);
      await loadReactions();
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre réaction",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant={userReaction === 'like' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleReaction('like')}
        disabled={loading}
        className="gap-2"
      >
        <ThumbsUp className={`h-4 w-4 ${userReaction === 'like' ? 'fill-current' : ''}`} />
        <span>{likes}</span>
      </Button>
      
      <Button
        variant={userReaction === 'dislike' ? 'destructive' : 'outline'}
        size="sm"
        onClick={() => handleReaction('dislike')}
        disabled={loading}
        className="gap-2"
      >
        <ThumbsDown className={`h-4 w-4 ${userReaction === 'dislike' ? 'fill-current' : ''}`} />
        <span>{dislikes}</span>
      </Button>
    </div>
  );
}
