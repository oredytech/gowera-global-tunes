import { useState, useEffect, useRef } from 'react';
import { Radio, Heart, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  addLiveComment, 
  getLiveComments, 
  deleteLiveComment, 
  subscribeLiveComments,
  LiveComment 
} from '@/services/supabase/radioInteractionService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface LiveCommentsProps {
  radioId: string;
}

export function LiveComments({ radioId }: LiveCommentsProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isDedication, setIsDedication] = useState(false);
  const [dedicationTo, setDedicationTo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadComments();
    
    const subscription = subscribeLiveComments(radioId, (newComment) => {
      setComments(prev => [newComment, ...prev]);
    });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [radioId]);

  const loadComments = async () => {
    try {
      const data = await getLiveComments(radioId);
      setComments(data);
    } catch (error) {
      console.error('Error loading live comments:', error);
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
    if (isDedication && !dedicationTo.trim()) {
      toast({
        title: "Dédicace incomplète",
        description: "Veuillez indiquer à qui est destinée la dédicace",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      await addLiveComment(radioId, newComment, isDedication, dedicationTo);
      setNewComment('');
      setDedicationTo('');
      setIsDedication(false);
    } catch (error) {
      console.error('Error adding live comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteLiveComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting live comment:', error);
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-card">
      <div className="flex items-center gap-2">
        <Radio className="h-5 w-5 text-primary animate-pulse" />
        <h3 className="text-lg font-semibold">Commentaires Live</h3>
        <Badge variant="secondary" className="ml-auto">En direct</Badge>
      </div>

      <ScrollArea className="h-[300px] pr-4" ref={scrollRef}>
        <div className="space-y-3">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Soyez le premier à commenter !
            </p>
          ) : (
            comments.map((comment) => (
              <div 
                key={comment.id} 
                className={`flex gap-2 p-3 rounded-lg ${
                  comment.is_dedication 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-muted/50'
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user_avatar_url} />
                  <AvatarFallback className="text-xs">
                    {comment.user_display_name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{comment.user_display_name}</span>
                    {comment.is_dedication && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Heart className="h-3 w-3 fill-current text-red-500" />
                        Dédicace pour {comment.dedication_to}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm mt-1 break-words">{comment.content}</p>
                </div>

                {currentUser?.id === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(comment.id)}
                    className="h-6 w-6 shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch 
                id="dedication" 
                checked={isDedication}
                onCheckedChange={setIsDedication}
              />
              <Label htmlFor="dedication" className="text-sm cursor-pointer">
                <Heart className="h-4 w-4 inline mr-1" />
                Dédicace
              </Label>
            </div>
            
            {isDedication && (
              <Input
                placeholder="Pour qui ?"
                value={dedicationTo}
                onChange={(e) => setDedicationTo(e.target.value)}
                className="max-w-[150px] h-8"
              />
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder={isDedication ? "Votre message de dédicace..." : "Votre message..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={submitting || !newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-muted-foreground text-sm text-center py-2">
          Connectez-vous pour participer au chat en direct
        </p>
      )}
    </div>
  );
}
