'use client';
import { formatDistanceStrict } from 'date-fns';
import ProfileBlock from './ProfileBlock';
import { useSession } from 'next-auth/react';
import { DropdownMenu } from './ui/DropdownMenu';
import { DropdownItem } from './ui/DropdownItem';
import { useContext } from 'react';
import { ToastContext } from '@/contexts/ToastContext';
import { BasicDialogsContext } from '@/contexts/BasicDialogsContext';

export default function Comment({
  id: commentId,
  content,
  createdAt,
  user: author,
  postAuthorId,
  postId,
  setComments,
}: CommentType & {
  postAuthorId: string;
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isOwnComment = userId === author.id;
  const { toastify } = useContext(ToastContext);
  const { confirm } = useContext(BasicDialogsContext);

  const deleteComment = async () => {
    const res = await fetch(
      `/api/users/${postAuthorId}/posts/${postId}/comments/${commentId}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok) {
      const data = await res.json();
      toastify({ type: 'success', title: 'Successfully Deleted' });
      setComments((prev) => prev.filter((comment) => comment.id !== data.id));
    } else {
      toastify({
        type: 'error',
        title: 'Error',
        message: 'Unable to delete this comment.',
      });
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex w-full justify-between">
        {isOwnComment && (
          <>
            <ProfileBlock
              type="comment"
              name={author.name!}
              photoUrl={author.profilePhoto!}
              time={formatDistanceStrict(new Date(createdAt), new Date())}
            />
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  confirm({
                    title: 'Confirm Delete',
                    message: 'Do you really wish to delete this comment?',
                    actionOnConfirm: deleteComment,
                  });
                }}
              >
                Delete Comment
              </DropdownItem>
            </DropdownMenu>
          </>
        )}
      </div>
      <p className="-mt-3 ml-[60px] p-3 bg-slate-200 rounded-2xl">{content}</p>
    </div>
  );
}
