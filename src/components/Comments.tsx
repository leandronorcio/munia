'use client';
import { useContext, useEffect, useState } from 'react';
import Comment from './Comment';
import Button from './ui/Button';
import ProfilePhoto from './ui/ProfilePhoto';
import TextArea from './ui/TextArea';
import { ToastContext } from '@/contexts/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';

export function Comments({
  postId,
  postAuthorId,
}: {
  postId: number;
  postAuthorId: string;
}) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState('');
  // Delay the animations of the <Comment> components on initial render of the <Comments> component.
  const [delayCommentAnimation, setDelayCommentAnimation] = useState(true);
  const { toastify } = useContext(ToastContext);

  useEffect(() => {
    const run = async () => {
      const res = await fetch(
        `/api/users/${postAuthorId}/posts/${postId}/comments`
      );

      if (!res.ok) {
        toastify({ title: 'Error Getting Comments', type: 'error' });
        return;
      }

      const data = (await res.json()) as { comments: CommentType[] };
      console.log(data);
      setComments(data.comments);
    };

    // Wait for the animation of the Component to finish before fetching comments.
    setTimeout(() => run(), 400);
  }, []);

  const postComment = async () => {
    const res = await fetch(
      `/api/users/${postAuthorId}/posts/${postId}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentText,
        } as CommentPOSTRequestBody),
      }
    );

    if (res.ok) {
      const addedComment = (await res.json()) as CommentType;
      setDelayCommentAnimation(false);
      setComments((prev) => [...prev, addedComment]);
      setCommentText('');
      toastify({ title: 'Comment Posted', type: 'success' });
    } else {
      toastify({ title: 'Comment Not Posted', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col gap-3 px-8 py-6 bg-gray-100">
      <AnimatePresence>
        {comments?.map((comment, i) => (
          <motion.div
            key={`${postId}-comments-${comment.id}`}
            initial={{ height: 0, x: 40 }}
            animate={{ height: 'auto', x: 0 }}
            exit={{ height: 0, x: 40 }}
            style={{ overflow: 'hidden' }}
            transition={{ delay: delayCommentAnimation ? i * 0.1 : 0 }}
          >
            <Comment key={i} {...comment} />
          </motion.div>
        ))}
      </AnimatePresence>
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
