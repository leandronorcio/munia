import { Item, Section } from 'react-stately';
import { useDialogs } from '@/hooks/useDialogs';
import { GetVisualMedia } from '@/types/definitions';
import { Key, useCallback } from 'react';
import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import { useDeletePostMutation } from '@/hooks/mutations/useDeletePostMutation';
import { DropdownMenuButton } from './ui/DropdownMenuButton';

export function PostOptions({
  postId,
  content,
  visualMedia,
}: {
  postId: number;
  content: string | null;
  visualMedia?: GetVisualMedia[];
}) {
  const { confirm } = useDialogs();
  const { launchEditPost } = useCreatePostModal();
  const { deleteMutation } = useDeletePostMutation();

  const handleDeleteClick = useCallback(() => {
    confirm({
      title: 'Delete Post',
      message: 'Do you really wish to delete this post?',
      onConfirm: () => {
        // Wait for the dialog to close before deleting the comment to pass the focus to
        // the next element first, preventing the focus from resetting to the top
        setTimeout(() => deleteMutation.mutate({ postId }), 300);
      },
    });
  }, [confirm, deleteMutation, postId]);

  const handleEditClick = useCallback(() => {
    launchEditPost({
      postId,
      initialContent: content ?? '',
      initialVisualMedia: visualMedia ?? [],
    });
  }, [launchEditPost, postId, content, visualMedia]);

  const handleOptionClick = useCallback(
    (key: Key) => {
      if (key === 'edit') {
        handleEditClick();
      } else {
        handleDeleteClick();
      }
    },
    [handleEditClick, handleDeleteClick],
  );

  return (
    <DropdownMenuButton key={`posts-${postId}-options`} label="Post options" onAction={handleOptionClick}>
      <Section>
        <Item key="edit">Edit Post</Item>
        <Item key="delete">Delete Post</Item>
      </Section>
    </DropdownMenuButton>
  );
}
