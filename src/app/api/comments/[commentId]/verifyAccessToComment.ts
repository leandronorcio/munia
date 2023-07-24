import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';

export const verifyAccessToComment = async (commentId: number) => {
  const [user] = await getServerUser();
  const count = await prisma.comment.count({
    where: {
      id: commentId,
      userId: user?.id,
    },
  });

  return count > 0;
};
