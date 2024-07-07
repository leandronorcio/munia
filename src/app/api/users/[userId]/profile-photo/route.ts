import { useUpdateProfileAndCoverPhoto } from '@/hooks/useUpdateProfileAndCoverPhoto';

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  return useUpdateProfileAndCoverPhoto({
    request,
    toUpdate: 'profilePhoto',
    userIdParam: params.userId,
  });
}
