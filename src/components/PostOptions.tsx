import { Item, Section } from 'react-stately';
import { DropdownMenuButton } from './ui/DropdownMenuButton';
import { useDialogs } from '@/hooks/useDialogs';
import { GetVisualMedia } from 'types';
import { Key, useCallback } from 'react';
import { useCreatePost } from '@/hooks/useCreatePost';
import { useDeletePostMutation } from '@/hooks/mutations/useDeletePostMutation';

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
  const { launchEditPost } = useCreatePost();
  const { deleteMutation } = useDeletePostMutation();

  const handleDeleteClick = () => {
    confirm({
      title: 'Delete Post',
      message: 'Do you really wish to delete this post?',
      onConfirm: () => {
        // Wait for the dialog to close before deleting the comment to pass the focus to
        // the next element first, preventing the focus from resetting to the top
        setTimeout(() => deleteMutation.mutate({ postId }), 300);
      },
    });
  };

  const editPost = useCallback(
    ({
      postId,
      content,
      visualMedia,
    }: {
      postId: number;
      content: string;
      visualMedia?: GetVisualMedia[];
    }) => {
      launchEditPost({
        postId,
        initialContent: content,
        initialVisualMedia: visualMedia || [],
      });
    },
    [],
  );

  const handleEditClick = () => {
    editPost({ postId, content: content || '', visualMedia });
  };

  const handleOptionClick = (key: Key) => {
    if (key === 'edit') return handleEditClick();
    handleDeleteClick();
  };

  return (
    <DropdownMenuButton
      key={`posts-${postId}-options`}
      label="Post options"
      onAction={handleOptionClick}
    >
      <Section>
        <Item key="edit">Edit Post</Item>
        <Item key="delete">Delete Post</Item>
      </Section>
    </DropdownMenuButton>
  );
}
