import { useUpdateProfileAndCoverPhoto } from '@/hooks/useUpdateProfileAndCoverPhoto';

export async function POST(
  request: Request,
  { params }: { params: { userId: string } },
) {
  return await useUpdateProfileAndCoverPhoto({
    request,
    toUpdate: 'profilePhoto',
    userIdParam: params.userId,
  });
}
