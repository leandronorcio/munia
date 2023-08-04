import { POSTS_PER_PAGE } from '@/constants';
import { GetPost } from 'types';

export async function fetchPosts({
  pageParam = 0,
  userId,
  type,
}: {
  pageParam: number;
  userId: string;
  type: 'profile' | 'feed';
}) {
  const endpoint = type === 'profile' ? 'posts' : 'feed';
  const params = new URLSearchParams();
  params.set('limit', POSTS_PER_PAGE.toString());
  params.set('cursor', pageParam.toString());

  const res = await fetch(
    `/api/users/${userId}/${endpoint}?${params.toString()}`,
  );

  if (!res.ok) {
    throw Error('Failed to load posts.');
  }

  return (await res.json()) as GetPost[];
}
