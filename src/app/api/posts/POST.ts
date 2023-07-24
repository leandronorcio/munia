/**
 * POST /api/posts
 * - Allows an authenticated user to create a post.
 */
import { useWritePost } from '@/hooks/useWritePost';
import { getServerUser } from '@/lib/getServerUser';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const [user] = await getServerUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const formData = await request.formData();
  return useWritePost({ formData, type: 'create' });
}
