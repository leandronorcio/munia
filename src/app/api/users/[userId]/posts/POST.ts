import { NextResponse } from 'next/server';
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { useWritePost } from '@/hooks/useWritePost';

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 401 });

  const formData = await request.formData();
  return useWritePost({ formData, userId: user.id, type: 'create' });
}
