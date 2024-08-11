import prisma from '@/lib/prisma/prisma';
import { redirect } from 'next/navigation';

/**
 * Use this page to redirect the user to the respective /posts/:postId
 * route of the comment from the given `commentId`.
 */
export default async function Page({ params }: { params: { commentId: string } }) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: parseInt(params.commentId, 10),
    },
    select: {
      id: true,
      postId: true,
      parentId: true,
    },
  });
  if (!comment) return <p>This comment or reply no longer exists.</p>;
  const { id: commentId, parentId, postId } = comment;

  const searchParams = new URLSearchParams('');
  searchParams.set('comment-id', commentId.toString());
  if (parentId) searchParams.set('comment-parent-id', parentId.toString());

  return redirect(`/posts/${postId}?${searchParams.toString()}`);
}
