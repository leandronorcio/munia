'use client';
import { useCallback, useState } from 'react';
import { Comment } from './Comment';
import Button from './ui/Button';
import { TextArea } from './ui/TextArea';
import { AnimatePresence, motion } from 'framer-motion';
import { GetComment } from 'types';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import { useQuery } from '@tanstack/react-query';
import { fetchComments } from '@/lib/query-functions/fetchComments';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { useSession } from 'next-auth/react';
import { useCommentsMutations } from '@/hooks/useCommentsMutations';

export function Comments({ postId }: { postId: number }) {
  const queryKey = ['posts', postId, 'comments'];
  const [commentText, setCommentText] = useState('');
  const {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
  } = useCommentsMutations(queryKey, setCommentText);
  const { data: session } = useSession();
  const { prompt, confirm } = useBasicDialogs();

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
    createCommentMutation.mutate({ postId, content: commentText });
  };

  const handleEdit = useCallback(
    ({ commentId, content }: { commentId: number; content: string }) => {
      prompt({
        title: 'Edit Comment',
        initialPromptValue: content,
        promptType: 'textarea',
        onSubmit: (value) => {
          updateCommentMutation.mutate({ commentId, content: value });
        },
      });
    },
    []
  );

  const handleDelete = useCallback(({ commentId }: { commentId: number }) => {
    confirm({
      title: 'Confirm Delete',
      message: 'Do you really wish to delete this comment?',
      onConfirm: () => deleteCommentMutation.mutate({ commentId }),
    });
  }, []);

  return (
    <div className="flex flex-col px-8 py-6 bg-gray-100">
      {isLoading ? (
        // TODO: Add fixed loading spinner here
        <></>
      ) : isError ? (
        error.message
      ) : (
        <AnimatePresence>
          {comments?.map((comment, i) => (
            <motion.div
              key={`${postId}-comments-${comment.id}`}
              initial={false}
              animate={{
                height: 'auto',
                x: 0,
                marginTop: '12px',
                overflow: 'visible',
              }}
              exit={{ height: 0, x: 40, marginTop: '0', overflow: 'hidden' }}
            >
              <Comment
                {...comment}
                {...{ handleEdit, handleDelete }}
                isOwnComment={session?.user?.id === comment.user.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      <div className="flex flex-row mt-3">
        <div className="w-11 h-11">
          <ProfilePhotoOwn />
        </div>
        <div className="flex-grow flex flex-col justify-center">
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
  );
}
