import { fetchReplies } from '@/lib/query-functions/fetchReplies';
import { useQuery } from '@tanstack/react-query';
import { CommentReply } from './CommentReply';
import { useSession } from 'next-auth/react';
import { useUpdateDeleteComments } from '@/hooks/useUpdateDeleteComments';
import { useLikeUnlikeComments } from '@/hooks/useLikeUnlikeComments';

export function CommentReplies({ parentId }: { parentId: number }) {
  const { data: session } = useSession();
  const queryKey = ['comments', parentId, 'replies'];
  const {
    data: replies,
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchReplies({ parentId }),
    staleTime: 60000 * 10,
  });
  const { handleEdit, handleDelete } = useUpdateDeleteComments({ queryKey });
  const { likeComment, unLikeComment } = useLikeUnlikeComments({ queryKey });

  if (isPending)
    return (
      <p className="text-sm font-semibold text-gray-500">Loading replies...</p>
    );
  if (isError)
    return (
      <p className="text-sm font-semibold text-gray-500">
        Error loading replies.
      </p>
    );
  return (
    <div>
      {replies.map((reply) => (
        <CommentReply
          key={`comments-${parentId}-replies-${reply.id}`}
          {...reply}
          {...{ handleEdit, handleDelete, likeComment, unLikeComment }}
          isOwnReply={session?.user.id === reply.user.id}
        />
      ))}
    </div>
  );
}
