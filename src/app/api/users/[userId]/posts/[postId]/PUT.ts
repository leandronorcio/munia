import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { useWritePost } from '@/hooks/useWritePost';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { userId: string; postId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 401 });

  const formData = await request.formData();
  return useWritePost({
    user,
    postId: parseInt(params.postId),
    type: 'edit',
    formData,
  });
}
