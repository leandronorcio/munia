/**
 * PATCH /api/posts/:postId
 * - Allows an authenticated user to edit a post.
 */
import { serverWritePost } from '@/hooks/serverWritePost';

export async function PATCH(request: Request, { params }: { params: { postId: string } }) {
  const postId = parseInt(params.postId, 10);

  const formData = await request.formData();
  return serverWritePost({
    formData,
    type: 'edit',
    postId,
  });
}
