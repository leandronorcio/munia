import { NextResponse } from 'next/server';
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { useUpdateProfileAndCoverPhoto } from '@/hooks/useUpdateProfileAndCoverPhoto';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.id)
    return NextResponse.json({}, { status: 401 });

  return await useUpdateProfileAndCoverPhoto(request, user, 'coverPhoto');
}
