/**
 * POST /api/posts
 * - Allows an authenticated user to create a post.
 */
import { serverWritePost } from '@/hooks/serverWritePost';

export async function POST(request: Request) {
  const formData = await request.formData();
  return serverWritePost({ formData, type: 'create' });
}
