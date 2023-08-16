'use client';

import { Post } from '@/components/Post';
import { useDeletePostMutation } from '@/hooks/mutations/useDeletePostMutation';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page({ params }: { params: { postId: string } }) {
  const postId = parseInt(params.postId);
  const [commentsShown, setCommentsShown] = useState(true);
  const { deleteMutation } = useDeletePostMutation();
  const { showToast } = useToast();
  const router = useRouter();

  const deletePost = () => {
    deleteMutation.mutate(
      { postId },
      {
        onSuccess: () => {
          router.back();
          showToast({
            title: 'Successfully Deleted',
          });
        },
      },
    );
  };
  const toggleComments = () => setCommentsShown((prev) => !prev);

  return (
    <div className="mt-4">
      <Post
        id={postId}
        commentsShown={commentsShown}
        deletePost={deletePost}
        toggleComments={toggleComments}
      />
    </div>
  );
}
