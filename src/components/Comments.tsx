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
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { useSession } from 'next-auth/react';
import { useCommentsMutations } from '@/hooks/mutations/useCommentsMutations';
import { useToast } from '@/hooks/useToast';
import { errorNotifer } from '@/lib/errorNotifier';

export function Comments({ postId }: { postId: number }) {
  const qc = useQueryClient();
  const queryKey = ['posts', postId, 'comments'];
  const [commentText, setCommentText] = useState('');
  const {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
  } = useCommentsMutations();
  const { data: session } = useSession();
  const { prompt, confirm } = useBasicDialogs();
  const { showToast } = useToast();

  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useQuery<GetComment[], Error>({
    queryKey: queryKey,
    queryFn: () => fetchComments({ postId }),
    staleTime: 1000 * 60 * 5,
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

  const handleEdit = useCallback(
    ({ commentId, content }: { commentId: number; content: string }) => {
      prompt({
        title: 'Edit Comment',
        initialPromptValue: content,
        promptType: 'textarea',
        onSubmit: async (value) => {
          /**
           * https://stackoverflow.com/a/71927346/8434369
           * The `onMutate` only exists on the options that you pass to `useMutation`,
           * not the ones that you pass to `mutate`.
           *
           * However, we can still optimistically update the comments
           * without relying on `onMutate`.
           */
          // Cancel outgoing queries
          await qc.cancelQueries({ queryKey: queryKey });

          // Snapshot the previous value
          const prevComments = qc.getQueryData(queryKey);

          // Optimistically update the comment
          qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
            if (!oldComments) return;

            // Make a shallow copy of the `oldComments`
            const newComments = [...oldComments];

            // Find the index of the updated comment
            const index = newComments.findIndex(
              (comment) => comment.id === commentId,
            );

            // Update the comment
            newComments[index] = {
              ...newComments[index],
              content: value,
            };

            return newComments;
          });

          updateCommentMutation.mutate(
            { commentId, content: value },
            {
              onError: (error) => {
                // Revert back to the snapshotted value when there's an error
                qc.setQueryData(queryKey, prevComments);
                errorNotifer(error);
              },
            },
          );
        },
      });
    },
    [],
  );

  const handleDelete = useCallback(({ commentId }: { commentId: number }) => {
    confirm({
      title: 'Confirm Delete',
      message: 'Do you really wish to delete this comment?',
      onConfirm: async () => {
        // Optimistically update the UI when the user confirms the deletion
        // Cancel outgoing queries
        await qc.cancelQueries({ queryKey: queryKey });

        // Snapshot the previous value
        const prevComments = qc.getQueryData(queryKey);

        // Optimistically remove the comment
        qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
          if (!oldComments) return;

          // Remove the deleted comment and return the new comments
          return oldComments.filter((comment) => comment.id !== commentId);
        });

        deleteCommentMutation.mutate(
          { commentId },
          {
            onError: (error) => {
              // Revert back to the snapshotted value when there's an error
              qc.setQueryData(queryKey, prevComments);
              errorNotifer(error);
            },
          },
        );
      },
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
              comments?.map((comment, i) => (
                <motion.div
                  key={`${postId}-comments-${comment.id}`}
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
                    {...{ handleEdit, handleDelete }}
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
        <div className="flex flex-row">
          <div className="h-10 w-10">
            <ProfilePhotoOwn />
          </div>
          <div className="flex flex-grow flex-col justify-center">
            <TextArea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleCreate}
            mode="secondary"
            size="small"
            disabled={commentText === ''}
            loading={createCommentMutation.isLoading}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
