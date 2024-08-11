'use client';

import { Post } from '@/components/Post';
import { useCallback, useState } from 'react';

export default function Page({ params }: { params: { postId: string } }) {
  const postId = parseInt(params.postId, 10);
  const [commentsShown, setCommentsShown] = useState(true);

  const toggleComments = useCallback(() => setCommentsShown((prev) => !prev), []);

  return (
    <div className="m-4">
      <Post id={postId} commentsShown={commentsShown} toggleComments={toggleComments} />
    </div>
  );
}
