/**
 * GET /api/users/:userId/photos
 * - Returns the visual media URLs of the specified user.
 */

import prisma from '@/lib/prisma/prisma';
import { fileNameToUrl } from '@/lib/s3/fileNameToUrl';
import { NextResponse } from 'next/server';
import { GetVisualMedia } from '@/types/definitions';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const res = await prisma.visualMedia.findMany({
    where: {
      userId: params.userId,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const visualMedia: GetVisualMedia[] | null = res.map((item) => ({
    type: item.type,
    url: fileNameToUrl(item.fileName)!,
  }));

  return NextResponse.json(visualMedia);
}
