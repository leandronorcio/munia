import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import prisma from '@/lib/prisma';

export const verifyAccessToComment = async (commentId: number) => {
  const [user] = await useProtectApiRoute();
  const count = await prisma.comment.count({
    where: {
      id: commentId,
      userId: user?.id,
    },
  });

  return count > 0;
};
