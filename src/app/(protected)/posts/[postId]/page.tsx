'use client';

import { Post } from '@/components/Post';
import { useState } from 'react';

export default function Page({ params }: { params: { postId: string } }) {
  const postId = parseInt(params.postId);
  const [commentsShown, setCommentsShown] = useState(true);

  const toggleComments = () => setCommentsShown((prev) => !prev);

  return (
    <div className="mt-4">
      <Post
        id={postId}
        commentsShown={commentsShown}
        toggleComments={toggleComments}
      />
    </div>
  );
}
