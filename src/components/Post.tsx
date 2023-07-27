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
import { ToggleStepper } from './ui/ToggleStepper';
import SvgHeart from '@/svg_components/Heart';

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
      <div className="overflow-hidden rounded-2xl bg-white">
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
        <div className="pb-2">
          <p className="mb-4 px-8 pt-4 text-lg text-gray-700">{content}</p>
          <div className="flex justify-start gap-2 border-t-2 p-2">
            <ToggleStepper
              onClick={handleLikeClick}
              Icon={SvgHeart}
              isActive={isLiked}
              quantity={numberOfLikes}
              noun="Like"
            />
            <ToggleStepper
              onClick={handleCommentsTogglerClick}
              Icon={SvgComment}
              isActive={commentsShown || false}
              quantity={_count.comments}
              noun="Comment"
              color="blue"
            />
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
