'use client';
import { formatDistanceStrict } from 'date-fns';
import ProfileBlock from './ProfileBlock';
import { DropdownMenu } from './ui/DropdownMenu';
import { DropdownItem } from './ui/DropdownItem';
import { GetComment } from 'types';
import { memo } from 'react';
import { isEqual } from 'lodash';

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
      <div className="flex flex-col items-start">
        <div className="flex w-full justify-between">
          <>
            <ProfileBlock
              type="comment"
              name={author.name!}
              username={author.username!}
              photoUrl={author.profilePhoto!}
              time={formatDistanceStrict(new Date(createdAt), new Date())}
            />
            {isOwnComment && (
              <DropdownMenu>
                <DropdownItem onClick={() => handleDelete({ commentId })}>
                  Delete Comment
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleEdit({ commentId, content })}
                >
                  Edit Comment
                </DropdownItem>
              </DropdownMenu>
            )}
          </>
        </div>
        <p className="-mt-3 ml-[60px] rounded-2xl bg-slate-200 p-3">
          {content}
        </p>
      </div>
    );
  },
  (oldProps, newProps) => isEqual(oldProps, newProps),
);
