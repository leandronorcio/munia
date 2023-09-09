'use client';
import { useCallback } from 'react';
import { Comment } from './Comment';
import { AnimatePresence, motion } from 'framer-motion';
import { GetComment } from 'types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchComments } from '@/lib/query-functions/fetchComments';
import { useSession } from 'next-auth/react';
import { useUpdateDeleteComments } from '@/hooks/useUpdateDeleteComments';
import { useLikeUnlikeComments } from '@/hooks/useLikeUnlikeComments';
import { CommentCreate } from './CommentCreate';
import { useShouldAnimate } from '@/hooks/useShouldAnimate';
import { commentFramerVariants } from '@/lib/framerVariants';

export function Comments({ postId }: { postId: number }) {
  const qc = useQueryClient();
  const queryKey = ['posts', postId, 'comments'];

  const { handleEdit, handleDelete } = useUpdateDeleteComments({ queryKey });
  const { likeComment, unLikeComment } = useLikeUnlikeComments({ queryKey });
  const { data: session } = useSession();
  const { shouldAnimate } = useShouldAnimate();

  const {
    data: comments,
    isPending,
    isError,
    error,
  } = useQuery<GetComment[], Error>({
    queryKey: queryKey,
    queryFn: () => fetchComments({ postId }),
    staleTime: 60000 * 10,
  });

  const toggleReplies = useCallback(({ commentId }: { commentId: number }) => {
    qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
      if (!oldComments) return;
      // Make a shallow copy of `oldComments`
      const newComments = [...oldComments];

      // Find the index of the comment to update
      const index = newComments.findIndex(
        (comment) => comment.id === commentId,
      );

      const oldComment = newComments[index];
      newComments[index] = {
        ...oldComment,
        repliesShown: !oldComment?.repliesShown,
      };
      return newComments;
    });
  }, []);

  return (
    <div>
      <div className="flex flex-col pt-2 ">
        {isPending ? (
          <p className="py-2 text-muted-foreground">Loading comments.</p>
        ) : isError ? (
          <p className="py-2 text-muted-foreground">{error.message}</p>
        ) : (
          <AnimatePresence>
            {comments.length > 0 ? (
              comments?.map((comment) => (
                <motion.div
                  variants={commentFramerVariants}
                  initial={shouldAnimate ? 'start' : false}
                  animate="animate"
                  exit="exit"
                  key={`posts-${postId}-comments-${comment.id}`}
                >
                  <Comment
                    {...comment}
                    {...{
                      handleEdit,
                      handleDelete,
                      toggleReplies,
                      likeComment,
                      unLikeComment,
                    }}
                    isOwnComment={session?.user?.id === comment.user.id}
                  />
                </motion.div>
              ))
            ) : (
              <p className="py-2 text-muted-foreground">
                Be the first to comment.
              </p>
            )}
          </AnimatePresence>
        )}
      </div>
      <CommentCreate postId={postId} />
    </div>
  );
}
