'use client';
import { Heart } from '@/svg_components';
import ProfileBlock from './ProfileBlock';
import PostVisualMediaContainer from './PostVisualMediaContainer';
import { memo, useContext, useState } from 'react';
import { areObjectsEqual } from '@/lib/areObjectsEqual';
import { sortVisualMedia } from '@/lib/sortVisualMedia';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/cn';
import { DropdownItem } from './ui/DropdownItem';
import { DropdownMenu } from './ui/DropdownMenu';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import SvgComment from '@/svg_components/Comment';
import { Comments } from './Comments';
import { AnimatePresence, motion } from 'framer-motion';
import { CreatePostModalContext } from '@/contexts/CreatePostModalContext';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { useToast } from '@/hooks/useToast';

export const Post = memo(
  function Post({
    id: postId,
    content,
    createdAt,
    user: author,
    visualMedia,
    postLikes,
    _count,
    setPosts,
    index,
  }: PostType & {
    setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
    index: number;
  }) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const isOwnPost = userId === author.id;
    // The postLikes prop contains zero or one item i.e. the <PostLike>'s id.
    const [likedId, setLikedId] = useState(postLikes[0]?.id || 0);
    // The numberOfLikes is not real-time, it only reacts to likePost and unLikePost.
    const [numberOfLikes, setNumberOfLikes] = useState(_count.postLikes);
    const [commentsShown, setCommentsShown] = useState(false);
    const { showToast } = useToast();
    const { confirm } = useBasicDialogs();
    const { launchEditPost } = useContext(CreatePostModalContext);
    console.log('rendered: ' + postId);
    const likePost = async () => {
      const res = await fetch(`/api/users/${userId}/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLikedId(data.id);
        setNumberOfLikes((prev) => prev + 1);
      } else {
        showToast({ title: 'Unable To Like', type: 'error' });
      }
    };

    const unlikePost = async () => {
      const res = await fetch(
        `/api/users/${userId}/posts/${postId}/likes/${likedId}`,
        {
          method: 'DELETE',
        }
      );

      if (res.ok) {
        setLikedId(0);
        setNumberOfLikes((prev) => prev - 1);
      } else {
        showToast({ title: 'Unable To Unlike', type: 'error' });
      }
    };

    const deletePost = async () => {
      const res = await fetch(`/api/users/${userId}/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        showToast({ title: 'Successfully Deleted', type: 'success' });
      } else {
        showToast({ title: 'Unable to Delete', type: 'error' });
      }
    };

    const editPost = () => {
      launchEditPost({
        postId,
        initialContent: content || '',
        initialVisualMedia: visualMedia,
        onSuccess: (editedPost) => {
          setPosts((prev) => {
            const arr = [...prev];
            arr[index] = editedPost;
            return arr;
          });
        },
      });
    };

    return (
      <div className="rounded-2xl bg-slate-50 overflow-hidden">
        <div className="flex justify-between items-center px-4 py-4 sm:px-8 sm:py-6">
          <ProfileBlock
            name={author.name!}
            time={formatDistanceStrict(new Date(createdAt), new Date())}
            photoUrl={author.profilePhoto!}
          />
          {isOwnPost && (
            <DropdownMenu>
              <DropdownItem
                onClick={() =>
                  confirm({
                    title: 'Delete Post',
                    message: 'Do you really wish to delete this post?',
                    onConfirm: deletePost,
                  })
                }
              >
                Delete Post
              </DropdownItem>
              <DropdownItem onClick={editPost}>Edit Post</DropdownItem>
            </DropdownMenu>
          )}
        </div>
        <PostVisualMediaContainer visualMedia={sortVisualMedia(visualMedia)} />
        <div className="px-8 py-4">
          <p className="text-lg text-gray-700 mb-8">{content}</p>
          <div className="flex justify-start gap-6">
            <div
              className={cn(
                'flex items-center gap-3 cursor-pointer px-4 py-2 rounded-xl hover:bg-pink-200'
              )}
              onClick={() => {
                likedId === 0 ? likePost() : unlikePost();
              }}
            >
              <Heart
                width={24}
                height={24}
                className={cn(
                  'stroke-black',
                  likedId !== 0 && 'stroke-none fill-red-500'
                )}
              />
              <p className="font-semibold text-lg text-gray-700 hidden sm:block">
                {numberOfLikes} {numberOfLikes === 1 ? 'Like' : 'Likes'}
              </p>
            </div>
            <div
              className={cn(
                'flex items-center gap-3 cursor-pointer px-4 py-2 rounded-xl hover:bg-blue-200'
              )}
              onClick={() => setCommentsShown((prev) => !prev)}
            >
              <SvgComment
                className={cn(
                  'stroke-black',
                  commentsShown && 'stroke-none fill-blue-500'
                )}
                width={24}
                height={24}
              />
              <p className="font-semibold text-lg text-gray-700 hidden sm:block">
                {_count.comments} Comments
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {commentsShown && (
            <motion.div
              key={`${postId}-comments`}
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
            >
              <Comments postId={postId} postAuthorId={author.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
  (oldProps, newProps) => areObjectsEqual(oldProps, newProps)
);
