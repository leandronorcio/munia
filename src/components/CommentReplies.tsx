import { getReplies } from '@/lib/client_data_fetching/getReplies';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useUpdateDeleteComments } from '@/hooks/useUpdateDeleteComments';
import { useLikeUnlikeComments } from '@/hooks/useLikeUnlikeComments';
import { AnimatePresence, motion } from 'framer-motion';
import { useShouldAnimate } from '@/hooks/useShouldAnimate';
import { commentFramerVariants } from '@/lib/framerVariants';
import { CommentReply } from './CommentReply';

export function CommentReplies({ parentId }: { parentId: number }) {
  const { data: session } = useSession();
  const queryKey = ['comments', parentId, 'replies'];
  const {
    data: replies,
    isPending,
    isError,
  } = useQuery({
    queryKey,
    queryFn: () => getReplies({ parentId }),
    staleTime: 60000 * 10,
  });
  const { handleEdit, handleDelete } = useUpdateDeleteComments({ queryKey });
  const { likeComment, unLikeComment } = useLikeUnlikeComments({ queryKey });
  const { shouldAnimate } = useShouldAnimate();

  if (isPending) return <p className="text-sm font-semibold text-gray-500">Loading replies...</p>;
  if (isError) return <p className="text-sm font-semibold text-gray-500">Error loading replies.</p>;

  return (
    <div>
      <AnimatePresence>
        {replies.map((reply) => (
          <motion.div
            variants={commentFramerVariants}
            initial={shouldAnimate ? 'start' : false}
            animate="animate"
            exit="exit"
            key={`comments-${parentId}-replies-${reply.id}`}>
            <CommentReply
              {...reply}
              {...{ handleEdit, handleDelete, likeComment, unLikeComment }}
              isOwnReply={session?.user.id === reply.user.id}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
