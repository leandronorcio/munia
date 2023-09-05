import 'server-only';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { v4 as uuid } from 'uuid';
import { uploadObject } from '@/lib/s3/uploadObject';
import { fileNameToUrl } from '@/lib/s3/fileNameToUrl';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export async function useUpdateProfileAndCoverPhoto(
  request: Request,
  userId: string,
  toUpdate: 'profilePhoto' | 'coverPhoto',
) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob | null;

  if (!file) {
    return NextResponse.json(
      { error: 'File blob is required.' },
      { status: 400 },
    );
  }

  try {
    const fileExtension = file.type.split('/')[1];
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type.' },
        { status: 400 },
      );
    }

    // Upload image to S3
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${uuid()}.${fileExtension}`;
    await uploadObject(buffer, fileName, fileExtension);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        [toUpdate]: fileName,
      },
    });

    return NextResponse.json({ uploadedTo: fileNameToUrl(fileName) });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
