/**
 * PATCH /api/posts/:postId
 * - Allows an authenticated user to edit a post.
 */
import { useWritePost } from '@/hooks/useWritePost';

export async function PATCH(
  request: Request,
  { params }: { params: { postId: string } },
) {
  const postId = parseInt(params.postId);

  const formData = await request.formData();
  return useWritePost({
    formData,
    type: 'edit',
    postId: postId,
  });
}
