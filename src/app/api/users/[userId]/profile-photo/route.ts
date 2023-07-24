import { NextResponse } from 'next/server';
import { useUpdateProfileAndCoverPhoto } from '@/hooks/useUpdateProfileAndCoverPhoto';
import { getServerUser } from '@/lib/getServerUser';

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const [user] = await getServerUser();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 401 });

  return await useUpdateProfileAndCoverPhoto(request, user.id, 'profilePhoto');
}
