/**
 * DELETE /api/posts/:postId
 * - Allows an authenticated user to delete a post.
 */

import { NextResponse } from 'next/server';
import { verifyAccessToPost } from './verifyAccessToPost';
import prisma from '@/lib/prisma/prisma';
import { unlink } from 'fs/promises';

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const postId = parseInt(params.postId);
  if (!verifyAccessToPost(postId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const res = await prisma.post.delete({
    select: {
      id: true,
      visualMedia: true,
    },
    where: {
      id: postId,
    },
  });

  // Delete the associated visualMedia files in the file system.
  const visualMediaFiles = res.visualMedia;
  for (const file of visualMediaFiles) {
    await unlink(`./public/${file.url}`);
  }

  return NextResponse.json({ id: res.id });
}
