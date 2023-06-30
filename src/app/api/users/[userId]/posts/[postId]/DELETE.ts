import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { unlink } from 'fs/promises';

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; postId: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.userId)
    return NextResponse.json({}, { status: 401 });

  const res = await prisma.post.delete({
    select: {
      id: true,
      visualMedia: true,
    },
    where: {
      id_userId: {
        id: parseInt(params.postId),
        userId: user.id,
      },
    },
  });

  // Delete the associated visualMedia files in the file system.
  const visualMediaFiles = res.visualMedia;
  for (const file of visualMediaFiles) {
    await unlink(`./public/${file.url}`);
  }

  return NextResponse.json({ id: res.id });
}
