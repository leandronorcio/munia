import { Item, Section } from 'react-stately';
import { DropdownMenuButton } from './ui/DropdownMenuButton';
import { useDialogs } from '@/hooks/useDialogs';
import { VisualMedia } from 'types';
import { Key, useCallback } from 'react';
import { useCreatePost } from '@/hooks/useCreatePost';

export function PostOptions({
  postId,
  content,
  visualMedia,
  deletePost,
}: {
  postId: number;
  content: string | null;
  visualMedia?: VisualMedia[];
  deletePost: (postId: number) => void;
}) {
  const { confirm } = useDialogs();
  const { launchEditPost } = useCreatePost();

  console.log('rendered: ' + postId);
  const handleDeleteClick = () => {
    confirm({
      title: 'Delete Post',
      message: 'Do you really wish to delete this post?',
      onConfirm: () => deletePost(postId),
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
      visualMedia?: VisualMedia[];
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
