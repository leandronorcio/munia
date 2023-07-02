'use client';
import { useEffect, useRef, useState } from 'react';
import { Post } from './Post';
import useOnScreen from '@/hooks/useOnScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';

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
  const loadingElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(loadingElRef);
  const { showToast } = useToast();

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
      showToast({
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
    <div className="min-h-[500px] flex flex-col justify-between">
      <div className="flex flex-col">
        <AnimatePresence>
          {posts.map((post, i) => {
            return (
              <motion.div
                initial={false}
                animate={{ height: 'auto', marginTop: '32px', opacity: 1 }}
                exit={{ height: 0, marginTop: '0px', opacity: 0 }}
                style={{ originY: 0, overflowY: 'hidden' }}
                transition={{ duration: 0.5 }}
                key={post.id}
              >
                <Post setPosts={setPosts} {...post} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="mt-6" ref={loadingElRef}>
        {/* {maxedOut
          ? pagination === 1
            ? 'No posts yet'
            : 'All posts loaded'
          : 'Loading posts...'} */}
      </div>
    </div>
  );
}
