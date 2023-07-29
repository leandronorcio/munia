'use client';
import { formatDistanceStrict } from 'date-fns';
import { DropdownMenu } from './ui/DropdownMenu';
import { DropdownItem } from './ui/DropdownItem';
import { GetComment } from 'types';
import { memo } from 'react';
import { isEqual } from 'lodash';
import { ProfilePhoto } from './ui/ProfilePhoto';
import { ToggleStepper } from './ui/ToggleStepper';
import SvgHeart from '@/svg_components/Heart';
import SvgArrowReply from '@/svg_components/ArrowReply';

export const Comment = memo(
  ({
    id: commentId,
    content,
    createdAt,
    user: author,
    isOwnComment,
    handleEdit,
    handleDelete,
  }: GetComment & {
    isOwnComment: boolean;
    handleEdit: (params: { commentId: number; content: string }) => void;
    handleDelete: (params: { commentId: number }) => void;
  }) => {
    console.log('rendered comment: ' + commentId);
    return (
      <div className="flex gap-4">
        <div className="h-10 w-10 flex-shrink-0">
          <ProfilePhoto
            userId={author.id}
            username={author.username}
            photoUrl={author.profilePhoto}
          />
        </div>

        <div>
          <h3 className="text-md font-semibold">{author.name}</h3>
          <p className="text-gray-499 text-gray-500">@{author.username}</p>
          <div className="my-2 self-start rounded-2xl rounded-ss-none bg-slate-100 px-4 py-3">
            <p className="mb-2 text-gray-700">{content}</p>
            <p className="ml-auto text-sm text-gray-500">
              {formatDistanceStrict(new Date(createdAt), new Date())} ago
            </p>
          </div>

          <div className="flex origin-left scale-90">
            <ToggleStepper
              onClick={() => {}}
              Icon={SvgHeart}
              isActive={false}
              quantity={2}
            />
            <ToggleStepper
              onClick={() => {}}
              Icon={SvgArrowReply}
              isActive={false}
              quantity={3}
              color="blue"
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
        </div>
      </div>
    );
  },
  (oldProps, newProps) => isEqual(oldProps, newProps),
);
