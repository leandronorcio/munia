'use client';

import { GetComment } from '@/types/definitions';
import { memo, useEffect, useCallback, Key } from 'react';
import { isEqual } from 'lodash';
import SvgHeart from '@/svg_components/Heart';
import SvgArrowReply from '@/svg_components/ArrowReply';
import { useSearchParams } from 'next/navigation';
import { useDialogs } from '@/hooks/useDialogs';
import { Item, Section } from 'react-stately';
import { useCreateCommentMutations } from '@/hooks/mutations/useCreateCommentMutations';
import { useUpdateDeleteComments } from '@/hooks/useUpdateDeleteComments';
import { useLikeUnlikeComments } from '@/hooks/useLikeUnlikeComments';
import { QueryKey } from '@tanstack/react-query';
import { ProfilePhoto } from './ui/ProfilePhoto';
import { ButtonNaked } from './ui/ButtonNaked';
import { DropdownMenuButton } from './ui/DropdownMenuButton';
import Button from './ui/Button';
import { CommentReplies } from './CommentReplies';
import { CommentContent } from './CommentContent';
import { ToggleStepper } from './ui/ToggleStepper';

export const Comment = memo(
  ({
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
    setRepliesVisibility: (params: { commentId: number; shown: boolean }) => void;
    queryKey: QueryKey;
  }) => {
    const numberOfLikes = _count.commentLikes;
    const numberOfReplies = _count.replies;
    const { prompt } = useDialogs();
    const { createReplyMutation } = useCreateCommentMutations();
    const { handleEdit, handleDelete } = useUpdateDeleteComments({ queryKey });
    const { likeComment, unLikeComment } = useLikeUnlikeComments({ queryKey });

    const searchParams = useSearchParams();
    // Highlight comment if the `commentId` is equal to the `comment-id` search param
    const shouldHighlight = searchParams.get('comment-id') === commentId.toString();

    const toggleReplies = useCallback(
      () => setRepliesVisibility({ commentId, shown: !repliesShown }),
      [commentId, repliesShown, setRepliesVisibility],
    );
    const handleCreateReply = useCallback(() => {
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
    }, [author.name, commentId, createReplyMutation, prompt, repliesShown, toggleReplies]);
    const handleLikeToggle = useCallback(
      (isSelected: boolean) => (isSelected ? likeComment({ commentId }) : unLikeComment({ commentId })),
      [commentId, likeComment, unLikeComment],
    );
    const onDropdownAction = useCallback(
      (key: Key) => {
        if (key === 'edit') {
          handleEdit({ commentId, content });
        } else {
          handleDelete({ commentId });
        }
      },
      [commentId, content, handleDelete, handleEdit],
    );

    // Show the replies if the comment to be highlighted is a reply to this comment
    useEffect(() => {
      setTimeout(() => {
        const shouldOpenRepliesOnMount = searchParams.get('comment-parent-id') === commentId.toString();
        if (shouldOpenRepliesOnMount) setRepliesVisibility({ commentId, shown: true });
      }, 1000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="flex gap-4">
        <div className="h-10 w-10 flex-shrink-0">
          <ProfilePhoto name={author.name} username={author.username} photoUrl={author.profilePhoto} />
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
            <ToggleStepper isSelected={isLiked} onChange={handleLikeToggle} Icon={SvgHeart} quantity={numberOfLikes} />
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
                onAction={onDropdownAction}>
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
              className="my-1 cursor-pointer text-sm font-semibold text-muted-foreground hover:text-muted-foreground/70">
              {!repliesShown ? `Show ${numberOfReplies} replies...` : 'Hide replies'}
            </ButtonNaked>
          )}
        </div>
      </div>
    );
  },
  (oldProps, newProps) => isEqual(oldProps, newProps),
);

Comment.displayName = 'Comment';
