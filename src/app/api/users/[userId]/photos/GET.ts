/**
 * GET /api/users/:userId/photos
 * - Returns the visual media URLs of the specified user.
 */

import prisma from '@/lib/prisma/prisma';
import { fileNameToUrl } from '@/lib/s3/fileNameToUrl';
import { NextResponse } from 'next/server';
import { GetVisualMedia } from '@/types/definitions';
import { VisualMedia } from '@prisma/client'; // import Prisma type

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  // Explicitly type the result from Prisma
  const res: VisualMedia[] = await prisma.visualMedia.findMany({
    where: {
      userId: params.userId,
    },
    orderBy: {
      id: 'desc',
    },
  });

  // Explicitly type 'item' in map
  const visualMedia: GetVisualMedia[] = res.map((item: VisualMedia) => ({
    type: item.type,
    url: fileNameToUrl(item.fileName)!,
  }));

  return NextResponse.json(visualMedia);
}
