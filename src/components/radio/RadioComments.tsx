import { useState, useEffect } from 'react';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { addComment, getComments, deleteComment, RadioComment } from '@/services/supabase/radioInteractionService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RadioCommentsProps {
  radioId: string;
}

export function RadioComments({ radioId }: RadioCommentsProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<RadioComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [radioId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await getComments(radioId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(radioId, newComment);
      setNewComment('');
      await loadComments();
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié"
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre commentaire",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      await loadComments();
      toast({
        title: "Commentaire supprimé"
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le commentaire",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Commentaires ({comments.length})</h3>
      </div>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Écrivez votre commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <Button type="submit" disabled={submitting || !newComment.trim()} className="gap-2">
            <Send className="h-4 w-4" />
            Publier
          </Button>
        </form>
      ) : (
        <p className="text-muted-foreground text-sm">
          Connectez-vous pour laisser un commentaire
        </p>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Chargement des commentaires...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground">Aucun commentaire pour le moment</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user_avatar_url} />
                <AvatarFallback>
                  {comment.user_display_name?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.user_display_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  
                  {currentUser?.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(comment.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <p className="mt-1 text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
