import { GetComment } from '@/types/definitions';

export async function getComments({ postId }: { postId: number }) {
  const res = await fetch(`/api/posts/${postId}/comments`);

  if (!res.ok) throw new Error('Error Getting Comments');
  return (await res.json()) as GetComment[];
}
