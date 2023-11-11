import { POSTS_PER_PAGE } from '@/constants';
import { GetPost } from '@/types/definitions';

type PostsProps =
  | {
      type: 'hashtag';
      userId?: undefined;
      hashtag: string;
      direction: 'forward' | 'backward';
      cursor: number;
    }
  | {
      type: 'profile' | 'feed';
      userId: string;
      hashtag?: undefined;
      direction: 'forward' | 'backward';
      cursor: number;
    };

export async function fetchPosts({
  type,
  userId,
  hashtag,
  direction,
  cursor,
}: PostsProps) {
  const isForwards = direction === 'forward';
  const params = new URLSearchParams('');

  params.set('limit', POSTS_PER_PAGE.toString());
  params.set('cursor', cursor.toString());
  params.set('sort-direction', isForwards ? 'desc' : 'asc');

  const fetchUrl =
    type === 'hashtag'
      ? `/api/posts/hashtag/${hashtag}`
      : `/api/users/${userId}/${type === 'profile' ? 'posts' : 'feed'}`;
  const res = await fetch(`${fetchUrl}?${params.toString()}`);

  if (!res.ok) throw Error('Failed to load posts.');
  return (await res.json()) as GetPost[];
}
