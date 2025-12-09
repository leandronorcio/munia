/**
 * DELETE /api/posts/:postId
 * - Allows an authenticated user to delete a post.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { deleteObject } from '@/lib/s3/deleteObject';
import { verifyAccessToPost } from './verifyAccessToPost';

export async function DELETE(request: Request, { params }: { params: { postId: string } }) {
  const postId = parseInt(params.postId, 10);

  if (!verifyAccessToPost(postId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Delete the post and retrieve the associated visualMedia
  const res = await prisma.post.delete({
    where: { id: postId },
    select: {
      id: true,
      visualMedia: {
        select: { fileName: true }, // select only fileName
      },
    },
  });

  // Delete the associated visualMedia files from S3
  const filenames = res.visualMedia.map((m: { fileName: string }) => m.fileName);
  await Promise.all(filenames.map(deleteObject));

  return NextResponse.json({ id: res.id });
}
