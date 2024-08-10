import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetComment } from '@/types/definitions';
import { useErrorNotifier } from '../useErrorNotifier';
import { useToast } from '../useToast';

export function useCreateCommentMutations() {
  const qc = useQueryClient();
  const { showToast } = useToast();
  const { notifyError } = useErrorNotifier();

  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!res.ok) throw new Error(res.statusText);
      return (await res.json()) as GetComment;
    },
    onSuccess: (createdComment) => {
      qc.setQueryData<GetComment[]>(['posts', createdComment.postId, 'comments'], (oldComments) => {
        if (!oldComments) return oldComments;
        return [...oldComments, createdComment];
      });
      showToast({
        title: 'Success',
        message: 'Your comment has been created.',
        type: 'success',
      });
    },
    onError: (err) => {
      notifyError(err);
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: async ({ parentId, content }: { parentId: number; content: string }) => {
      const res = await fetch(`/api/comments/${parentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!res.ok) throw new Error(res.statusText);
      return (await res.json()) as GetComment;
    },
    onSuccess: (createdReply) => {
      qc.setQueryData<GetComment[]>(['comments', createdReply.parentId, 'replies'], (oldReplies) => {
        if (!oldReplies) return oldReplies;
        return [...oldReplies, createdReply];
      });
      showToast({
        title: 'Success',
        message: 'Your reply has been created.',
        type: 'success',
      });
    },
    onError: (err) => {
      notifyError(err);
    },
  });

  return {
    createCommentMutation,
    createReplyMutation,
  };
}
