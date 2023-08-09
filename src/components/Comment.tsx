'use client';
import { DropdownMenu } from './ui/DropdownMenu';
import { DropdownItem } from './ui/DropdownItem';
import { GetComment } from 'types';
import { memo } from 'react';
import { isEqual } from 'lodash';
import { ToggleStepper } from './ui/ToggleStepper';
import SvgHeart from '@/svg_components/Heart';
import SvgArrowReply from '@/svg_components/ArrowReply';
import { CommentContent } from './CommentContent';
import { CommentProfilePhoto } from './CommentProfilePhoto';
import { IconButton } from './ui/IconButton';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { useCommentsMutations } from '@/hooks/mutations/useCommentsMutations';
import { CommentReplies } from './CommentReplies';
import { errorNotifer } from '@/lib/errorNotifier';
import { useQueryClient } from '@tanstack/react-query';

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
    const { prompt } = useBasicDialogs();
    const { createReplyMutation } = useCommentsMutations();

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
                console.log(createdReply);
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
                errorNotifer(err);
              },
            },
          );
        },
      });
    };

    const handleLikeClick = () =>
      !isLiked ? likeComment({ commentId }) : unLikeComment({ commentId });
    const handleToggleReplies = () => toggleReplies({ commentId });

    return (
      <div className="flex gap-4">
        <CommentProfilePhoto
          userId={author.id}
          username={author.username}
          photoUrl={author.profilePhoto}
        />

        <div>
          <CommentContent
            name={author.name}
            username={author.username}
            content={content}
            createdAt={createdAt}
          />

          <div className="flex origin-left">
            <ToggleStepper
              onClick={handleLikeClick}
              Icon={SvgHeart}
              isActive={isLiked}
              quantity={numberOfLikes}
            />
            <IconButton
              Icon={SvgArrowReply}
              onClick={handleCreateReply}
              loading={createReplyMutation.isLoading}
            />
            {isOwnComment && (
              <DropdownMenu width="auto">
                <DropdownItem onClick={() => handleDelete({ commentId })}>
                  Delete
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleEdit({ commentId, content })}
                >
                  Edit
                </DropdownItem>
              </DropdownMenu>
            )}
          </div>

          {repliesShown && <CommentReplies parentId={commentId} />}
          {numberOfReplies !== 0 && (
            <p
              onClick={handleToggleReplies}
              className="my-1 cursor-pointer text-sm font-semibold text-gray-500 hover:text-gray-800"
            >
              {!repliesShown
                ? `View ${numberOfReplies} replies...`
                : 'Hide replies'}
            </p>
          )}
        </div>
      </div>
    );
  },
  (oldProps, newProps) => isEqual(oldProps, newProps),
);
