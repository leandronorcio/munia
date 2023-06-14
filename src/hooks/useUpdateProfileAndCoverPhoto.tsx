import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function useUpdateProfileAndCoverPhoto(
  request: Request,
  user: CustomUser,
  toUpdate: 'profilePhoto' | 'coverPhoto'
) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob | null;

  if (!file) {
    return NextResponse.json(
      { error: 'File blob is required.' },
      { status: 400 }
    );
  }

  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const fileType = file.type.split('/')[1];
  if (!allowedFileTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Unsupported file type.' },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${user.id}-${Date.now()}-${toUpdate}.${fileType}`;
    const fullURL = `./public/uploads/${fileName}`;

    const updateUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        [toUpdate]: fullURL.replace('./public', ''),
      },
    });
    await writeFile(fullURL, buffer);
    return NextResponse.json(
      { uploadedTo: updateUser[toUpdate] },
      { status: 200 }
    );
  } catch (error) {
    console.log('Errorrr: ' + error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
