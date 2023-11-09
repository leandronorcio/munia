'use client';
import { GetComment } from '@/types/definitions';
import { memo } from 'react';
import { isEqual } from 'lodash';
import { ToggleStepper } from './ui/ToggleStepper';
import SvgHeart from '@/svg_components/Heart';
import { CommentContent } from './CommentContent';
import { useSearchParams } from 'next/navigation';
import { DropdownMenuButton } from './ui/DropdownMenuButton';
import { Item, Section } from 'react-stately';
import { ProfilePhoto } from './ui/ProfilePhoto';

export const CommentReply = memo(
  function CommentReply({
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
  }) {
    const numberOfLikes = _count.commentLikes;
    const handleLikeClick = () =>
      !isLiked ? likeComment({ commentId }) : unLikeComment({ commentId });

    const searchParams = useSearchParams();
    // Highlight comment if the `commentId` is equal to the `comment-id` search param
    const shouldHighlight =
      searchParams.get('comment-id') === commentId.toString();

    return (
      <div className="mt-2 flex gap-4">
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

          <div className="flex origin-left">
            <ToggleStepper
              isSelected={isLiked}
              onPress={handleLikeClick}
              Icon={SvgHeart}
              quantity={numberOfLikes}
            />
            {isOwnReply && (
              <DropdownMenuButton
                key={`replies-${commentId}-options`}
                label="Reply options"
                onAction={(key) => {
                  key === 'edit'
                    ? handleEdit({ commentId, content })
                    : handleDelete({ commentId });
                }}
              >
                <Section>
                  <Item key="edit">Edit reply</Item>
                  <Item key="delete">Delete reply</Item>
                </Section>
              </DropdownMenuButton>
            )}
          </div>
        </div>
      </div>
    );
  },
  (oldProps, newProps) => isEqual(oldProps, newProps),
);
