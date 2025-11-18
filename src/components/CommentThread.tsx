import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Comment {
  id: string;
  display_name: string;
  message: string;
  created_at: string;
}

interface CommentThreadProps {
  itemId: string;
}

export default function CommentThread({ itemId }: CommentThreadProps) {
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('item_id', itemId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Comment[];
    },
  });

  const mutation = useMutation({
    mutationFn: async (newComment: { display_name: string; message: string }) => {
      // Basic sanitization
      const sanitizedMessage = newComment.message
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();
      
      const sanitizedName = newComment.display_name
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();

      if (!sanitizedMessage || !sanitizedName) {
        throw new Error('Name and message are required');
      }

      if (sanitizedMessage.length > 1000) {
        throw new Error('Message must be less than 1000 characters');
      }

      if (sanitizedName.length > 100) {
        throw new Error('Name must be less than 100 characters');
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          item_id: itemId,
          display_name: sanitizedName,
          message: sanitizedMessage,
          status: 'approved'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', itemId] });
      setDisplayName('');
      setMessage('');
      toast.success('Comment posted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to post comment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ display_name: displayName, message });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Comments</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor={`name-${itemId}`} className="text-xs">Your Name</Label>
          <Input
            id={`name-${itemId}`}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name"
            maxLength={100}
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor={`comment-${itemId}`} className="text-xs">Comment</Label>
          <Textarea
            id={`comment-${itemId}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
            maxLength={1000}
            required
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {message.length}/1000 characters
          </p>
        </div>

        <Button 
          type="submit" 
          size="sm"
          disabled={mutation.isPending}
          className="w-full"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            'Post Comment'
          )}
        </Button>
      </form>

      <div className="space-y-3 mt-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        ) : !comments || comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-muted/50 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{comment.display_name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-foreground/80">{comment.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
