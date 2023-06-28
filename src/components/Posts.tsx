'use client';
import { ToastContext } from '@/contexts/ToastContext';
import { useContext, useEffect, useRef, useState } from 'react';
import { Post } from './Post';
import useOnScreen from '@/hooks/useOnScreen';

export function Posts({
  type,
  userId,
}: {
  type: 'profile' | 'newsFeed';
  userId: string;
}) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [pagination, setPagination] = useState(0);
  const [maxedOut, setMaxedOut] = useState(false);
  const { toastify } = useContext(ToastContext);
  const loadingElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(loadingElRef);

  const retrievePosts = async () => {
    if (maxedOut) return;
    const postsPerPage = 3;
    const limit = postsPerPage;
    const offset = pagination * postsPerPage;
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

    const { posts: retrievedPosts } = (await res.json()) as {
      posts: PostType[];
    };
    if (retrievedPosts.length === 0) {
      setMaxedOut(true);
      return;
    }
    setPosts((prev) => [...prev, ...retrievedPosts]);
  };

  useEffect(() => {
    retrievePosts();
  }, [pagination]);

  useEffect(() => {
    if (isBottomOnScreen === true) setPagination((prev) => prev + 1);
  }, [isBottomOnScreen]);

  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => {
        return <Post key={post.id} setPosts={setPosts} {...post} />;
      })}
      <div onClick={() => setPagination((prev) => prev + 1)} ref={loadingElRef}>
        {maxedOut
          ? pagination === 1
            ? 'No posts yet'
            : 'All posts loaded'
          : 'Loading posts...'}
      </div>
    </div>
  );
}
