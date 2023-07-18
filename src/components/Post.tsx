'use client';
import { Heart } from '@/svg_components';
import ProfileBlock from './ProfileBlock';
import PostVisualMediaContainer from './PostVisualMediaContainer';
import { memo, useState } from 'react';
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
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { GetPost, VisualMedia } from 'types';

export const Post = memo(
  function Post({
    id: postId,
    content,
    createdAt,
    user: author,
    visualMedia,
    postLikes,
    _count,
    likePost,
    unLikePost,
    deletePost,
    editPost,
  }: GetPost & {
    likePost: (postId: number) => void;
    unLikePost: (postId: number) => void;
    deletePost: (postId: number) => void;
    editPost: (params: {
      postId: number;
      content: string;
      visualMedia?: VisualMedia[];
    }) => void;
  }) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const isOwnPost = userId === author.id;
    const numberOfLikes = _count.postLikes;
    const isPostLiked = postLikes.length > 0;

    const [commentsShown, setCommentsShown] = useState(false);
    const { confirm } = useBasicDialogs();

    console.log('rendered + ' + postId);
    const handleLikeClick = () => {
      !isPostLiked ? likePost(postId) : unLikePost(postId);
    };

    const handleDeleteClick = () => {
      confirm({
        title: 'Delete Post',
        message: 'Do you really wish to delete this post?',
        onConfirm: () => deletePost(postId),
      });
    };

    const handleEditClick = () => {
      editPost({ postId, content: content || '', visualMedia });
    };

    const toggleCommentsSection = () => {
      setCommentsShown((prev) => !prev);
    };

    return (
      <div className="rounded-2xl bg-slate-50 overflow-hidden">
        <div className="flex justify-between items-center px-4 py-4 sm:px-8 sm:py-6">
          <ProfileBlock
            name={author.name!}
            username={author.username!}
            time={formatDistanceStrict(new Date(createdAt), new Date())}
            photoUrl={author.profilePhoto!}
          />
          {isOwnPost && (
            <DropdownMenu>
              <DropdownItem onClick={handleDeleteClick}>
                Delete Post
              </DropdownItem>
              <DropdownItem onClick={handleEditClick}>Edit Post</DropdownItem>
            </DropdownMenu>
          )}
        </div>
        {visualMedia.length > 0 && (
          <PostVisualMediaContainer
            visualMedia={sortVisualMedia(visualMedia)}
          />
        )}
        <div className="px-8 py-4">
          <p className="text-lg text-gray-700 mb-8">{content}</p>
          <div className="flex justify-start gap-3 -ml-4">
            <div
              className={cn(
                'flex items-center gap-3 cursor-pointer px-4 py-2 rounded-xl hover:bg-pink-200 active:ring-4 ring-pink-300'
              )}
              onClick={handleLikeClick}
            >
              <Heart
                width={24}
                height={24}
                className={cn(
                  'stroke-black',
                  isPostLiked && 'stroke-none fill-red-500'
                )}
              />
              <p className="font-semibold text-lg text-gray-700 hidden sm:block">
                {numberOfLikes} {numberOfLikes === 1 ? 'Like' : 'Likes'}
              </p>
            </div>
            <div
              className={cn(
                'flex items-center gap-3 cursor-pointer px-4 py-2 rounded-xl hover:bg-blue-200 active:ring-4 ring-blue-300'
              )}
              onClick={toggleCommentsSection}
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
