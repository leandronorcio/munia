'use client';
import ProfileBlock from './ProfileBlock';
import PostVisualMediaContainer from './PostVisualMediaContainer';
import { memo, useEffect } from 'react';
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
import { GetPost, PostIds, VisualMedia } from 'types';
import { isEqual } from 'lodash';
import { ToggleStepper } from './ui/ToggleStepper';
import SvgHeart from '@/svg_components/Heart';
import { useQuery } from '@tanstack/react-query';
import { usePostLikesMutations } from '@/hooks/mutations/usePostLikesMutations';

export const Post = memo(
  function Post({
    id: postId,
    commentsShown,
    deletePost,
    editPost,
    toggleComments,
  }: PostIds & {
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

    const { data } = useQuery<GetPost>({
      queryKey: ['posts', postId],
      queryFn: async () => {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) {
          throw new Error('Error getting post');
        }
        return (await res.json()) as GetPost;
      },
      staleTime: 60000 * 10,
    });

    // We can be sure that `data` exists as the <Posts> have already cached the post's data
    const {
      content,
      createdAt,
      user: author,
      visualMedia,
      isLiked,
      _count,
    } = data!;

    const isOwnPost = userId === author.id;
    const numberOfLikes = _count.postLikes;
    const { likeMutation, unLikeMutation } = usePostLikesMutations({ postId });
    const likePost = () => likeMutation.mutate();
    const unLikePost = () => unLikeMutation.mutate();
    const { confirm } = useBasicDialogs();
    console.log('rendered: ' + postId);

    const handleLikeClick = () => {
      !isLiked ? likePost() : unLikePost();
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
      <div className="rounded-2xl bg-white px-4 shadow sm:px-8">
        <div className="flex items-center justify-between pt-4 sm:pt-5">
          <ProfileBlock
            userId={author.id}
            name={author.name!}
            username={author.username!}
            time={formatDistanceStrict(new Date(createdAt), new Date())}
            photoUrl={author.profilePhoto!}
          />
          {isOwnPost && (
            <DropdownMenu width="200px">
              <DropdownItem onClick={handleDeleteClick}>
                Delete Post
              </DropdownItem>
              <DropdownItem onClick={handleEditClick}>Edit Post</DropdownItem>
            </DropdownMenu>
          )}
        </div>
        {content && (
          <p className="mb-4 mt-5 text-lg text-gray-700">{content}</p>
        )}
        {visualMedia.length > 0 && (
          <div className="mb-4 mt-5 overflow-hidden rounded-2xl">
            <PostVisualMediaContainer
              visualMedia={sortVisualMedia(visualMedia)}
            />
          </div>
        )}
        <div
          className={cn([
            'flex justify-start gap-2 border-y-2 py-2',
            !commentsShown && 'border-b-transparent',
          ])}
        >
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

        <AnimatePresence>
          {commentsShown && (
            <motion.div
              key={`${postId}-comments`}
              initial={false}
              animate={{ height: 'auto', overflow: 'visible' }}
              exit={{ height: 0, overflow: 'hidden' }}
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
