'use client';
import { useCallback, useState } from 'react';
import { Comment } from './Comment';
import Button from './ui/Button';
import { TextArea } from './ui/TextArea';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';
import { CommentType } from 'types';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchComments } from '@/lib/query-functions/fetchComments';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { useSession } from 'next-auth/react';

export function Comments({ postId }: { postId: number }) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const [commentText, setCommentText] = useState('');
  const { prompt, confirm } = useBasicDialogs();
  const { showToast } = useToast();

  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useQuery<CommentType[], Error>({
    queryKey: ['posts', postId, 'comments'],
    queryFn: () => fetchComments({ postId }),
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: number;
      content: string;
    }) => {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!res.ok) {
        throw new Error('Error Creating Comment');
      }

      return (await res.json()) as CommentType;
    },
    onSuccess: (createdPost) => {
      qc.setQueryData<CommentType[]>(
        ['posts', postId, 'comments'],
        (oldComments) => {
          if (!oldComments) return;
          return [...oldComments, createdPost];
        }
      );

      setCommentText('');
    },
    onError: (err: Error) => {
      showToast({ type: 'error', title: err.message });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content }),
      });

      if (!res.ok) {
        throw new Error('Error Updating Comment');
      }

      return (await res.json()) as CommentType;
    },
    onSuccess: (updatedComment) => {
      qc.setQueryData<CommentType[]>(
        ['posts', postId, 'comments'],
        (oldComments) => {
          if (!oldComments) return;

          // Make a shallow copy of the `oldComments`
          const newComments = [...oldComments];

          // Find the index of the updated comment
          const index = newComments.findIndex(
            (comment) => comment.id === updatedComment.id
          );

          // Update the comment
          newComments[index] = updatedComment;

          // Return the updated data
          return newComments;
        }
      );
    },
    onError: (err: Error) => {
      showToast({ type: 'error', title: err.message });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId }: { commentId: number }) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error Deleting Comment');
      }

      return (await res.json()) as { id: number };
    },
    onSuccess: ({ id }) => {
      qc.setQueryData<CommentType[]>(
        ['posts', postId, 'comments'],
        (oldComments) => {
          if (!oldComments) return;

          // Remove the deleted comment and return the new comments
          return oldComments.filter((comment) => comment.id !== id);
        }
      );
    },
    onError: (err: Error) => {
      showToast({ type: 'error', title: err.message });
    },
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
        >
          Comment
        </Button>
      </div>
    </div>
  );
}
