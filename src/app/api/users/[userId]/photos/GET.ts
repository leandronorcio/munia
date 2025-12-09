import prisma from '@/lib/prisma/prisma';
import { fileNameToUrl } from '@/lib/s3/fileNameToUrl';
import { NextResponse } from 'next/server';
import { GetVisualMedia } from '@/types/definitions';
import type { VisualMedia } from '@prisma/client'; // only type import

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const res: VisualMedia[] = await prisma.visualMedia.findMany({
    where: {
      userId: params.userId,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const visualMedia: GetVisualMedia[] = res.map((item: VisualMedia) => ({
    type: item.type,
    url: fileNameToUrl(item.fileName)!,
  }));

  return NextResponse.json(visualMedia);
}
