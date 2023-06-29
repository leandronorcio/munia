'use client';
import { formatDistanceStrict } from 'date-fns';
import ProfileBlock from './ProfileBlock';
import { useSession } from 'next-auth/react';
import { DropdownMenu } from './ui/DropdownMenu';
import { DropdownItem } from './ui/DropdownItem';
import { useContext, useState } from 'react';
import { ToastContext } from '@/contexts/ToastContext';
import { BasicDialogsContext } from '@/contexts/BasicDialogsContext';

export default function Comment({
  id: commentId,
  content: initialContent,
  createdAt,
  user: author,
  postAuthorId,
  postId,
  setComments,
}: CommentType & {
  postAuthorId: string;
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}) {
  // Use this state when the comment is edited.
  const [content, setContent] = useState(initialContent);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isOwnComment = userId === author.id;
  const { toastify } = useContext(ToastContext);
  const { confirm, prompt } = useContext(BasicDialogsContext);

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

  const editComment = async (newValue: string) => {
    const res = await fetch(
      `/api/users/${postAuthorId}/posts/${postId}/comments/${commentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newValue } as CommentPUTRequestBody),
      }
    );

    if (res.ok) {
      setContent(newValue);
      toastify({ type: 'success', title: 'Successfully Edited' });
    } else {
      toastify({
        type: 'error',
        title: 'Error',
        message: 'Unable to edit this comment.',
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
              <DropdownItem
                onClick={() => {
                  prompt({
                    title: 'Edit Comment',
                    initialPromptValue: content,
                    actionOnSubmit: (value) => {
                      editComment(value);
                    },
                  });
                }}
              >
                Edit Comment
              </DropdownItem>
            </DropdownMenu>
          </>
        )}
      </div>
      <p className="-mt-3 ml-[60px] p-3 bg-slate-200 rounded-2xl">{content}</p>
    </div>
  );
}
