/**
 * PATCH /api/posts/:postId
 * - Allows an authenticated user to edit a post.
 */
import { useWritePost } from '@/hooks/useWritePost';
import { NextResponse } from 'next/server';
import { verifyAccessToPost } from './verifyAccessToPost';

export async function PATCH(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const postId = parseInt(params.postId);
  if (!verifyAccessToPost(postId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const formData = await request.formData();
  return useWritePost({
    postId: postId,
    type: 'edit',
    formData,
  });
}
