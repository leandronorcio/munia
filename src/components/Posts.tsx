'use client';
import { useEffect, useRef, useState } from 'react';
import { Post } from './Post';
import useOnScreen from '@/hooks/useOnScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';
import { CreatePostModalLauncher } from './CreatePostModalLauncher';

export function Posts({
  type,
  userId,
}: {
  type: 'profile' | 'newsFeed';
  userId: string;
}) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [maxedOut, setMaxedOut] = useState(false);
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const { showToast } = useToast();

  const retrievePosts = async () => {
    if (maxedOut) return;
    const postsPerPage = 3;
    const limit = postsPerPage;
    const url = new URL(
      document.location.origin + `/api/users/${userId}/posts`
    );
    url.searchParams.set('limit', limit.toString());
    if (cursor !== null) url.searchParams.set('cursor', cursor.toString());

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
  }, [cursor]);

  useEffect(() => {
    if (isBottomOnScreen === true) {
      const [{ id: bottomPostId }] = posts.slice(-1);
      //                                   ^ returns an array containing the last post object
      setCursor(bottomPostId);
    }
  }, [isBottomOnScreen]);

  return (
    <div className="min-h-[830px] flex flex-col justify-between">
      <div className="flex flex-col">
        <CreatePostModalLauncher
          onSuccess={(post) => setPosts((prev) => [post, ...prev])}
        />

        <AnimatePresence>
          {posts.map((post, i) => {
            return (
              <motion.div
                initial={{ height: 0, marginTop: '0px', opacity: 0 }}
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
      <div className="mt-6" ref={bottomElRef}>
        {/* Bottom element, if on screen, increase the pagination state. */}
      </div>
    </div>
  );
}
