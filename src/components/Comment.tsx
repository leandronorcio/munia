'use client';
import { GetComment } from '@/types/definitions';
import { memo, useEffect } from 'react';
import { isEqual } from 'lodash';
import { ToggleStepper } from './ui/ToggleStepper';
import SvgHeart from '@/svg_components/Heart';
import SvgArrowReply from '@/svg_components/ArrowReply';
import { CommentContent } from './CommentContent';
import { CommentReplies } from './CommentReplies';
import { useSearchParams } from 'next/navigation';
import Button from './ui/Button';
import { useDialogs } from '@/hooks/useDialogs';
import { DropdownMenuButton } from './ui/DropdownMenuButton';
import { Item, Section } from 'react-stately';
import { ButtonNaked } from './ui/ButtonNaked';
import { useCreateCommentMutations } from '@/hooks/mutations/useCreateCommentMutations';
import { ProfilePhoto } from './ui/ProfilePhoto';
import { useUpdateDeleteComments } from '@/hooks/useUpdateDeleteComments';
import { useLikeUnlikeComments } from '@/hooks/useLikeUnlikeComments';
import { QueryKey } from '@tanstack/react-query';

export const Comment = memo(
  function Comment({
    id: commentId,
    content,
    createdAt,
    user: author,
    isOwnComment,
    isLiked,
    _count,
    repliesShown,
    setRepliesVisibility,
    queryKey,
  }: GetComment & {
    isOwnComment: boolean;
    setRepliesVisibility: (params: {
      commentId: number;
      shown: boolean;
    }) => void;
    queryKey: QueryKey;
  }) {
    const numberOfLikes = _count.commentLikes;
    const numberOfReplies = _count.replies;
    const { prompt } = useDialogs();
    const { createReplyMutation } = useCreateCommentMutations();
    const { handleEdit, handleDelete } = useUpdateDeleteComments({ queryKey });
    const { likeComment, unLikeComment } = useLikeUnlikeComments({ queryKey });

    const searchParams = useSearchParams();
    // Highlight comment if the `commentId` is equal to the `comment-id` search param
    const shouldHighlight =
      searchParams.get('comment-id') === commentId.toString();

    const toggleReplies = () =>
      setRepliesVisibility({ commentId, shown: !repliesShown });
    const handleCreateReply = () => {
      prompt({
        title: 'Reply',
        message: `You are replying to ${author.name}'s comment.`,
        promptType: 'textarea',
        onSubmit: (value) => {
          createReplyMutation.mutate(
            {
              parentId: commentId,
              content: value,
            },
            {
              onSuccess: () => !repliesShown && toggleReplies(),
            },
          );
        },
      });
    };

    const handleLikeToggle = (isSelected: boolean) =>
      isSelected ? likeComment({ commentId }) : unLikeComment({ commentId });

    // Show the replies if the comment to be highlighted is a reply to this comment
    useEffect(() => {
      setTimeout(() => {
        const shouldOpenRepliesOnMount =
          searchParams.get('comment-parent-id') === commentId.toString();
        if (shouldOpenRepliesOnMount)
          setRepliesVisibility({ commentId, shown: true });
      }, 1000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="flex gap-4">
        <div className="h-10 w-10 flex-shrink-0">
          <ProfilePhoto
            name={author.name}
            username={author.username}
            photoUrl={author.profilePhoto}
          />
        </div>

        <div>
          <CommentContent
            name={author.name}
            username={author.username}
            content={content}
            createdAt={createdAt}
            shouldHighlight={shouldHighlight}
          />

          <div className="flex gap-2">
            <ToggleStepper
              isSelected={isLiked}
              onChange={handleLikeToggle}
              Icon={SvgHeart}
              quantity={numberOfLikes}
            />
            <Button
              onPress={handleCreateReply}
              Icon={SvgArrowReply}
              loading={createReplyMutation.isPending}
              mode="ghost"
            />

            {isOwnComment && (
              <DropdownMenuButton
                key={`comments-${commentId}-options`}
                label="Comment options"
                onAction={(key) => {
                  key === 'edit'
                    ? handleEdit({ commentId, content })
                    : handleDelete({ commentId });
                }}
              >
                <Section>
                  <Item key="edit">Edit comment</Item>
                  <Item key="delete">Delete comment</Item>
                </Section>
              </DropdownMenuButton>
            )}
          </div>

          {repliesShown && <CommentReplies parentId={commentId} />}
          {numberOfReplies !== 0 && (
            <ButtonNaked
              onPress={toggleReplies}
              className="my-1 cursor-pointer text-sm font-semibold text-muted-foreground hover:text-muted-foreground/70"
            >
              {!repliesShown
                ? `Show ${numberOfReplies} replies...`
                : 'Hide replies'}
            </ButtonNaked>
          )}
        </div>
      </div>
    );
  },
  (oldProps, newProps) => isEqual(oldProps, newProps),
);
