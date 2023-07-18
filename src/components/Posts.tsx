'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Post } from './Post';
import useOnScreen from '@/hooks/useOnScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';
import { CreatePostModalLauncher } from './CreatePostModalLauncher';
import { GetPost, VisualMedia } from 'types';
import { useCreatePost } from '@/hooks/useCreatePost';

export function Posts({
  type,
  userId,
  shouldShowCreatePost,
}: {
  type: 'profile' | 'newsFeed';
  userId: string;
  shouldShowCreatePost: boolean;
}) {
  const [posts, setPosts] = useState<GetPost[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [maxedOut, setMaxedOut] = useState(false);
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const { launchEditPost } = useCreatePost();
  const { showToast } = useToast();

  const retrievePosts = async () => {
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
      posts: GetPost[];
    };
    if (retrievedPosts.length === 0) {
      setMaxedOut(true);
      return;
    }
    setPosts((prev) => [...prev, ...retrievedPosts]);
  };

  useEffect(() => {
    if (maxedOut) return;
    retrievePosts();
  }, [cursor]);

  useEffect(() => {
    if (isBottomOnScreen === true) {
      if (posts.length > 0) {
        const [{ id: bottomPostId }] = posts.slice(-1);
        //                                   ^ returns an array containing the last post object
        setCursor(bottomPostId);
      }
    }
  }, [isBottomOnScreen]);

  const likePost = useCallback(
    async (postId: number) => {
      const res = await fetch(`/api/users/${userId}/liked-posts`, {
        method: 'POST',
        body: JSON.stringify({ postId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPosts((prevPosts) => {
          // Find the index of the post using the `postId` param
          const index = prevPosts.findIndex((post) => post.id === postId);
          const prevPost = prevPosts[index];

          // Create a new `posts` object
          const newPosts = [...prevPosts];

          // Like the target `post`
          newPosts[index] = {
            ...prevPost,
            postLikes: [data.id],
            _count: {
              ...prevPost._count,
              postLikes: newPosts[index]._count.postLikes + 1,
            },
          };

          return newPosts;
        });
      } else {
        showToast({ title: 'Unable To Like', type: 'error' });
      }
    },
    [userId]
  );

  const unLikePost = useCallback(
    async (postId: number) => {
      const res = await fetch(`/api/users/${userId}/liked-posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPosts((prevPosts) => {
          // Find the index of the post using the `postId` param
          const index = prevPosts.findIndex((post) => post.id === postId);
          const prevPost = prevPosts[index];

          // Create a new `posts` object
          const newPosts = [...prevPosts];

          // Like the target `post`
          newPosts[index] = {
            ...prevPost,
            postLikes: [],
            _count: {
              ...prevPost._count,
              postLikes: newPosts[index]._count.postLikes - 1,
            },
          };

          return newPosts;
        });
      } else {
        showToast({ title: 'Unable To Unlike', type: 'error' });
      }
    },
    [userId]
  );

  const deletePost = useCallback(async (postId: number) => {
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      showToast({ title: 'Successfully Deleted', type: 'success' });
    } else {
      showToast({ title: 'Unable to Delete', type: 'error' });
    }
  }, []);

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
        onSuccess: (editedPost) => {
          setPosts((prev) => {
            const posts = [...prev];
            const index = posts.findIndex((post) => post.id === postId);
            posts[index] = editedPost;
            return posts;
          });
        },
      });
    },
    []
  );

  return (
    <div className="flex flex-col justify-between">
      <div className="flex flex-col">
        {shouldShowCreatePost && (
          <CreatePostModalLauncher
            onSuccess={(post) => setPosts((prev) => [post, ...prev])}
          />
        )}

        <AnimatePresence>
          {posts.map((post) => {
            return (
              <motion.div
                initial={{ height: 0, marginTop: '0px', opacity: 0 }}
                animate={{ height: 'auto', marginTop: '32px', opacity: 1 }}
                exit={{ height: 0, marginTop: '0px', opacity: 0 }}
                style={{ originY: 0, overflowY: 'hidden' }}
                transition={{ duration: 0.5 }}
                key={post.id}
              >
                <Post
                  {...post}
                  {...{ likePost, unLikePost, editPost, deletePost }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="mt-6" ref={bottomElRef}>
        {/* Bottom element, if on screen, set the cursor state to the bottom post id. */}
      </div>
    </div>
  );
}
