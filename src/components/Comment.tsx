'use client';
import { GetComment } from 'types';
import { memo, useEffect } from 'react';
import { isEqual } from 'lodash';
import { ToggleStepper } from './ui/ToggleStepper';
import SvgHeart from '@/svg_components/Heart';
import SvgArrowReply from '@/svg_components/ArrowReply';
import { CommentContent } from './CommentContent';
import { CommentProfilePhoto } from './CommentProfilePhoto';
import { useCommentsMutations } from '@/hooks/mutations/useCommentsMutations';
import { CommentReplies } from './CommentReplies';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Button from './ui/Button';
import { useDialogs } from '@/hooks/useDialogs';
import { DropdownMenuButton } from './ui/DropdownMenuButton';
import { Item, Section } from 'react-stately';
import { ButtonNaked } from './ui/ButtonNaked';
import { useErrorNotifier } from '@/hooks/useErrorNotifier';

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
    handleEdit,
    handleDelete,
    toggleReplies,
    likeComment,
    unLikeComment,
  }: GetComment & {
    isOwnComment: boolean;
    handleEdit: (params: { commentId: number; content: string }) => void;
    handleDelete: (params: { commentId: number }) => void;
    toggleReplies: (params: { commentId: number }) => void;
    likeComment: (params: { commentId: number }) => void;
    unLikeComment: (params: { commentId: number }) => void;
  }) => {
    const qc = useQueryClient();
    const numberOfLikes = _count.commentLikes;
    const numberOfReplies = _count.replies;
    const { prompt } = useDialogs();
    const { createReplyMutation } = useCommentsMutations();
    const { notifyError } = useErrorNotifier();

    const searchParams = useSearchParams();
    // Highlight comment if the `commentId` is equal to the `comment-id` search param
    const shouldHighlight =
      searchParams.get('comment-id') === commentId.toString();

    // Show the replies if the comment to be highlighted is a reply to this comment
    useEffect(() => {
      const shouldOpenRepliesOnMount =
        searchParams.get('comment-parent-id') === commentId.toString();
      if (!shouldOpenRepliesOnMount) return;
      if (repliesShown) return;
      toggleReplies({ commentId });
    }, []);

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
              onSuccess: (createdReply) => {
                qc.setQueryData<GetComment[]>(
                  ['comments', commentId, 'replies'],
                  (oldReplies) => {
                    if (!oldReplies) return;
                    return [...oldReplies, createdReply];
                  },
                );
                if (!repliesShown) toggleReplies({ commentId });
              },
              onError: (err) => {
                notifyError(err);
              },
            },
          );
        },
      });
    };

    const handleLikeToggle = (isSelected: boolean) =>
      isSelected ? likeComment({ commentId }) : unLikeComment({ commentId });
    const handleToggleReplies = () => toggleReplies({ commentId });

    return (
      <div className="flex gap-4">
        <CommentProfilePhoto
          username={author.username}
          photoUrl={author.profilePhoto}
        />

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
              onPress={handleToggleReplies}
              className="my-1 cursor-pointer text-sm font-semibold text-gray-500 hover:text-gray-800"
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
