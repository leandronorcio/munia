'use client';
import { useCallback, useState } from 'react';
import { Comment } from './Comment';
import Button from './ui/Button';
import { TextArea } from './ui/TextArea';
import { AnimatePresence, motion } from 'framer-motion';
import { GetComment } from 'types';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchComments } from '@/lib/query-functions/fetchComments';
import { useSession } from 'next-auth/react';
import { useCommentsMutations } from '@/hooks/mutations/useCommentsMutations';
import { errorNotifer } from '@/lib/errorNotifier';
import { useUpdateDeleteComments } from '@/hooks/useUpdateDeleteComments';
import { useLikeUnlikeComments } from '@/hooks/useLikeUnlikeComments';
import SvgSend from '@/svg_components/Send';

export function Comments({ postId }: { postId: number }) {
  const qc = useQueryClient();
  const queryKey = ['posts', postId, 'comments'];
  const [commentText, setCommentText] = useState('');
  const { createCommentMutation } = useCommentsMutations();
  const { handleEdit, handleDelete } = useUpdateDeleteComments({ queryKey });
  const { likeComment, unLikeComment } = useLikeUnlikeComments({ queryKey });
  const { data: session } = useSession();

  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useQuery<GetComment[], Error>({
    queryKey: queryKey,
    queryFn: () => fetchComments({ postId }),
    staleTime: 60000 * 10,
  });

  const handleCreate = () => {
    createCommentMutation.mutate(
      { postId, content: commentText },
      {
        onSuccess: (createdComment) => {
          qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
            if (!oldComments) return;
            return [...oldComments, createdComment];
          });

          setCommentText('');
        },

        onError: (error) => errorNotifer(error),
      },
    );
  };

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
      <div className="flex flex-col bg-white pt-2 ">
        {isLoading ? (
          <p className="py-2 text-gray-600">Loading comments.</p>
        ) : isError ? (
          <p className="py-2 text-gray-600">{error.message}</p>
        ) : (
          <AnimatePresence>
            {comments.length > 0 ? (
              comments?.map((comment) => (
                <motion.div
                  key={`posts-${postId}-comments-${comment.id}`}
                  initial={false}
                  animate={{
                    height: 'auto',
                    x: 0,
                    marginTop: '6px',
                    overflow: 'visible',
                  }}
                  exit={{
                    height: 0,
                    x: 40,
                    marginTop: '0px',
                    overflow: 'hidden',
                  }}
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
              <p className="py-2 text-gray-600">Be the first to comment.</p>
            )}
          </AnimatePresence>
        )}
      </div>
      <div className="mt-2 border-t-2 py-4">
        <div className="flex">
          <div className="h-10 w-10">
            <ProfilePhotoOwn />
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <TextArea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
            />
          </div>
          <div className="self-end">
            <Button
              onClick={handleCreate}
              mode="secondary"
              size="small"
              disabled={commentText === ''}
              loading={createCommentMutation.isLoading}
              Icon={SvgSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
