'use client';
import { useEffect, useState } from 'react';
import Comment from './Comment';
import Button from './ui/Button';
import ProfilePhoto from './ui/ProfilePhoto';
import { TextArea } from './ui/TextArea';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';

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
  const { showToast } = useToast();

  useEffect(() => {
    const run = async () => {
      const res = await fetch(
        `/api/users/${postAuthorId}/posts/${postId}/comments`
      );

      if (!res.ok) {
        showToast({ title: 'Error Getting Comments', type: 'error' });
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
      showToast({ title: 'Comment Posted', type: 'success' });
    } else {
      showToast({ title: 'Comment Not Posted', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col px-8 py-6 bg-gray-100">
      <AnimatePresence>
        {comments?.map((comment, i) => (
          <motion.div
            key={`${postId}-comments-${comment.id}`}
            initial={{ height: 0, x: 40, marginTop: '0', overflow: 'hidden' }}
            animate={{
              height: 'auto',
              x: 0,
              marginTop: '12px',
              overflow: 'visible',
            }}
            exit={{ height: 0, x: 40, marginTop: '0', overflow: 'hidden' }}
            transition={{ delay: delayCommentAnimation ? i * 0.125 : 0 }}
          >
            <Comment
              key={i}
              {...comment}
              postAuthorId={postAuthorId}
              setComments={setComments}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="flex flex-row mt-3">
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
