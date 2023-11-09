/**
 * POST /api/posts
 * - Allows an authenticated user to create a post.
 */
import { useWritePost } from '@/hooks/useWritePost';

export async function POST(request: Request) {
  const formData = await request.formData();
  return useWritePost({ formData, type: 'create' });
}
