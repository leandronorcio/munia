import { CommentType } from 'types';

export const fetchComments = async ({ postId }: { postId: number }) => {
  const res = await fetch(`/api/posts/${postId}/comments`);

  if (!res.ok) {
    throw new Error('Error Getting Comments');
  }

  return (await res.json()) as CommentType[];
};
