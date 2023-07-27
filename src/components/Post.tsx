'use client';
import { Heart } from '@/svg_components';
import ProfileBlock from './ProfileBlock';
import PostVisualMediaContainer from './PostVisualMediaContainer';
import { memo } from 'react';
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
import { isEqual } from 'lodash';

export const Post = memo(
  function Post({
    id: postId,
    content,
    createdAt,
    user: author,
    visualMedia,
    isLiked,
    _count,
    commentsShown,
    likePost,
    unLikePost,
    deletePost,
    editPost,
    toggleComments,
  }: GetPost & {
    likePost: (postId: number) => void;
    unLikePost: (postId: number) => void;
    deletePost: (postId: number) => void;
    editPost: (params: {
      postId: number;
      content: string;
      visualMedia?: VisualMedia[];
    }) => void;
    toggleComments: (postId: number) => void;
  }) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const isOwnPost = userId === author.id;
    const numberOfLikes = _count.postLikes;

    const { confirm } = useBasicDialogs();

    console.log('rendered + ' + postId);
    const handleLikeClick = () => {
      !isLiked ? likePost(postId) : unLikePost(postId);
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

    const handleCommentsTogglerClick = () => {
      toggleComments(postId);
    };

    return (
      <div className="overflow-hidden rounded-2xl bg-slate-50">
        <div className="flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
          <ProfileBlock
            userId={author.id}
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
          <p className="mb-8 text-lg text-gray-700">{content}</p>
          <div className="-ml-4 flex justify-start gap-3">
            <div
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2 ring-pink-300 hover:bg-pink-200 active:ring-4',
              )}
              onClick={handleLikeClick}
            >
              <Heart
                width={24}
                height={24}
                className={cn(
                  'stroke-black',
                  isLiked && 'fill-red-500 stroke-none',
                )}
              />
              <p className="hidden text-lg font-semibold text-gray-700 sm:block">
                {numberOfLikes} {numberOfLikes === 1 ? 'Like' : 'Likes'}
              </p>
            </div>
            <div
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2 ring-blue-300 hover:bg-blue-200 active:ring-4',
              )}
              onClick={handleCommentsTogglerClick}
            >
              <SvgComment
                className={cn(
                  'stroke-black',
                  commentsShown && 'fill-blue-500 stroke-none',
                )}
                width={24}
                height={24}
              />
              <p className="hidden text-lg font-semibold text-gray-700 sm:block">
                {_count.comments} Comments
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {commentsShown && (
            <motion.div
              key={`${postId}-comments`}
              initial={false}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
            >
              <Comments postId={postId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
  (oldProps, newProps) => isEqual(oldProps, newProps),
);
