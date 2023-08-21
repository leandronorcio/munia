'use client';
import { DropdownMenu } from './ui/DropdownMenu';
import { DropdownItem } from './ui/DropdownItem';
import { GetComment } from 'types';
import { memo } from 'react';
import { isEqual } from 'lodash';
import { ToggleStepper } from './ui/ToggleStepper';
import SvgHeart from '@/svg_components/Heart';
import { CommentContent } from './CommentContent';
import { CommentProfilePhoto } from './CommentProfilePhoto';
import { useSearchParams } from 'next/navigation';

export const CommentReply = memo(
  ({
    id: commentId,
    content,
    createdAt,
    user: author,
    isOwnReply,
    isLiked,
    _count,
    handleEdit,
    handleDelete,
    likeComment,
    unLikeComment,
  }: GetComment & {
    isOwnReply: boolean;
    handleEdit: (params: { commentId: number; content: string }) => void;
    handleDelete: (params: { commentId: number }) => void;
    likeComment: (params: { commentId: number }) => void;
    unLikeComment: (params: { commentId: number }) => void;
  }) => {
    const numberOfLikes = _count.commentLikes;
    const handleLikeClick = () =>
      !isLiked ? likeComment({ commentId }) : unLikeComment({ commentId });

    const searchParams = useSearchParams();
    // Highlight comment if the `commentId` is equal to the `comment-id` search param
    const shouldHighlight =
      searchParams.get('comment-id') === commentId.toString();

    return (
      <div className="mt-2 flex gap-4">
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
            shouldHighlight={shouldHighlight}
          />

          <div className="flex origin-left">
            <ToggleStepper
              onClick={handleLikeClick}
              Icon={SvgHeart}
              isActive={isLiked}
              quantity={numberOfLikes}
            />
            {isOwnReply && (
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
        </div>
      </div>
    );
  },
  (oldProps, newProps) => isEqual(oldProps, newProps),
);
