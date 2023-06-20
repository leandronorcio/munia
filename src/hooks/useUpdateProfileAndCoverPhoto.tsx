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

  try {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const extension = file.type.split('/')[1];
    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type.' },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `./uploads/${
      user.id
    }-${Date.now()}-${toUpdate}.${extension}`;
    await writeFile(`./public/${filePath}`, buffer);

    const updateUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        [toUpdate]: filePath,
      },
    });

    return NextResponse.json(
      { uploadedTo: updateUser[toUpdate] },
      { status: 200 }
    );
  } catch (error) {
    console.log('Errorrr: ' + error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
