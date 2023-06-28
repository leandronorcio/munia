import { useContext, useState } from 'react';
import Comment from './Comment';
import Button from './ui/Button';
import ProfilePhoto from './ui/ProfilePhoto';
import TextArea from './ui/TextArea';
import { useSession } from 'next-auth/react';
import { ToastContext } from '@/contexts/ToastContext';

export function Comments({ postId }: { postId: number }) {
  const [commentText, setCommentText] = useState('');
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { toastify } = useContext(ToastContext);

  const postComment = async () => {
    const res = await fetch(`/api/users/${userId}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: commentText } as CommentPOSTRequestBody),
    });

    if (res.ok) {
      toastify({ title: 'Comment Posted', type: 'success' });
      setCommentText('');
    } else {
      toastify({ title: 'Comment Not Posted', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col gap-3 px-8 py-6">
      <Comment />
      <div className="flex flex-row ">
        <div className="w-11 h-11">
          <ProfilePhoto />
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <TextArea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={postComment}
          mode="secondary"
          size="small"
          disabled={commentText === ''}
        >
          Comment
        </Button>
      </div>
    </div>
  );
}
