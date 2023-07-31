import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { errorNotifer } from '@/lib/errorNotifier';
import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { GetComment } from 'types';
import { useCommentsMutations } from './mutations/useCommentsMutations';

export function useUpdateDeleteComments({ queryKey }: { queryKey: QueryKey }) {
  const qc = useQueryClient();
  const { updateCommentMutation, deleteCommentMutation } =
    useCommentsMutations();
  const { prompt, confirm } = useBasicDialogs();

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

  return { handleEdit, handleDelete };
}
