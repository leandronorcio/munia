import { useDialogs } from '@/hooks/useDialogs';
import { QueryKey } from '@tanstack/react-query';
import { useUpdateDeleteCommentMutations } from './mutations/useUpdateDeleteCommentMutations';

// Use this hook for updating and deleting comments/replies.
export function useUpdateDeleteComments({ queryKey }: { queryKey: QueryKey }) {
  const { updateCommentMutation, deleteCommentMutation } = useUpdateDeleteCommentMutations({ queryKey });
  const { prompt, confirm } = useDialogs();

  const handleEdit = ({ commentId, content }: { commentId: number; content: string }) => {
    prompt({
      title: 'Edit Comment',
      initialPromptValue: content,
      promptType: 'textarea',
      onSubmit: async (value) => {
        updateCommentMutation.mutate({ commentId, content: value });
      },
    });
  };

  const handleDelete = ({ commentId }: { commentId: number }) => {
    confirm({
      title: 'Confirm Delete',
      message: 'Do you really wish to delete this comment?',
      onConfirm: () => {
        // Wait for the dialog to close before deleting the comment to pass the focus to
        // the next element first, preventing the focus from resetting to the top
        setTimeout(async () => {
          deleteCommentMutation.mutate({ commentId });
        }, 300);
      },
    });
  };

  return { handleEdit, handleDelete };
}
