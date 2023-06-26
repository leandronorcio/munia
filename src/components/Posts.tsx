'use client';
import { ToastContext } from '@/contexts/ToastContext';
import { useContext, useEffect, useState } from 'react';
import Post from './Post';

export function Posts({
  type,
  userId,
}: {
  type: 'profile' | 'newsFeed';
  userId: string;
}) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [pagination, setPagination] = useState(0);
  const { toastify } = useContext(ToastContext);

  useEffect(() => {
    const run = async () => {
      const limit = 5;
      const offset = pagination * 5;
      const url = new URL(
        document.location.origin + `/api/users/${userId}/posts`
      );
      url.searchParams.set('limit', limit.toString());
      url.searchParams.set('offset', offset.toString());

      const res = await fetch(url);

      if (!res.ok) {
        toastify({
          type: 'error',
          title: 'Error',
          message: 'There was an error getting the posts.',
        });
      }

      const { posts: retrievedPosts } = await res.json();
      setPosts(retrievedPosts);
    };
    run();
  }, [pagination]);

  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => {
        return <Post key={post.id} {...post} />;
      })}
    </div>
  );
}
