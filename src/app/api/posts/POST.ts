/**
 * POST /api/posts
 * - Allows an authenticated user to create a post.
 */
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { useWritePost } from '@/hooks/useWritePost';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const [user] = await useProtectApiRoute();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const formData = await request.formData();
  return useWritePost({ formData, type: 'create' });
}
