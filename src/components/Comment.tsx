'use client';
import { formatDistanceStrict } from 'date-fns';
import ProfileBlock from './ProfileBlock';
import { useSession } from 'next-auth/react';
import { DropdownMenu } from './ui/DropdownMenu';
import { DropdownItem } from './ui/DropdownItem';
import { CommentType } from 'types';

export default function Comment({
  id: commentId,
  content,
  createdAt,
  user: author,
  isOwnComment,
  handleEdit,
  handleDelete,
}: CommentType & {
  isOwnComment: boolean;
  handleEdit: (params: { commentId: number; content: string }) => void;
  handleDelete: (params: { commentId: number }) => void;
}) {
  const { data: session } = useSession();

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
              <DropdownItem onClick={() => handleEdit({ commentId, content })}>
                Edit Comment
              </DropdownItem>
            </DropdownMenu>
          )}
        </>
      </div>
      <p className="-mt-3 ml-[60px] p-3 bg-slate-200 rounded-2xl">{content}</p>
    </div>
  );
}
