'use client';
import ProfileBlock from './ProfileBlock';
import PostVisualMediaContainer from './PostVisualMediaContainer';
import { memo } from 'react';
import { sortVisualMedia } from '@/lib/sortVisualMedia';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/cn';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import SvgComment from '@/svg_components/Comment';
import { Comments } from './Comments';
import { AnimatePresence, motion } from 'framer-motion';
import { GetPost, PostIds } from 'types';
import { isEqual } from 'lodash';
import { ToggleStepper } from './ui/ToggleStepper';
import SvgHeart from '@/svg_components/Heart';
import { useQuery } from '@tanstack/react-query';
import { usePostLikesMutations } from '@/hooks/mutations/usePostLikesMutations';
import { HighlightedMentionsAndHashTags } from './HighlightedMentionsAndHashTags';
import { PostOptions } from './PostOptions';

export const Post = memo(
  function Post({
    id: postId,
    commentsShown,
    deletePost,
    toggleComments,
  }: PostIds & {
    deletePost: (postId: number) => void;
    toggleComments: (postId: number) => void;
  }) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const { likeMutation, unLikeMutation } = usePostLikesMutations({ postId });

    const { data, isPending, isError } = useQuery<GetPost>({
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

    const likePost = () => likeMutation.mutate();
    const unLikePost = () => unLikeMutation.mutate();

    const handleLikeToggle = (isSelected: boolean) => {
      isSelected ? likePost() : unLikePost();
    };

    const handleCommentsToggle = () => {
      toggleComments(postId);
    };

    if (isPending) return <p>Loading...</p>;
    if (isError) return <p>Error loading post.</p>;
    if (!data) return <p>This post no longer exists.</p>;

    const {
      content,
      createdAt,
      user: author,
      visualMedia,
      isLiked,
      _count,
    } = data;
    const isOwnPost = userId === author.id;
    const numberOfLikes = _count.postLikes;

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
            <PostOptions
              postId={postId}
              content={content}
              visualMedia={visualMedia}
              deletePost={deletePost}
            />
          )}
        </div>
        {content && (
          <p className="mb-4 mt-5 text-lg text-gray-700">
            <HighlightedMentionsAndHashTags
              text={content}
              shouldAddLinks={true}
            />
          </p>
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
            isSelected={isLiked}
            onChange={handleLikeToggle}
            Icon={SvgHeart}
            quantity={numberOfLikes}
            noun="Like"
          />
          <ToggleStepper
            isSelected={commentsShown || false}
            onChange={handleCommentsToggle}
            Icon={SvgComment}
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
