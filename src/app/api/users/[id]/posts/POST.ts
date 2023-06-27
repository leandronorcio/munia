import { NextResponse } from 'next/server';
import { useProtectApiRoute } from '@/hooks/useProtectApiRoute';
import { writeFile } from 'fs/promises';
import { listOfKeyValuesToObject } from '@/lib/listOfKeyValuesToObject';
import prisma from '@/lib/prisma';

interface UserPostsPostRequestBody {
  content?: string;
  files?: Blob | Blob[];
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const [user] = await useProtectApiRoute();
  if (!user || user.id !== params.id)
    return NextResponse.json({}, { status: 401 });

  const formData = await request.formData();
  const body = listOfKeyValuesToObject(formData) as UserPostsPostRequestBody;
  const { content, files } = body;
  const savedFiles: VisualMedia[] = [];

  try {
    if (files) {
      await new Promise<void>((resolve) => {
        // Convert 'files' field to an array if it is not.
        const filesArr = Array.isArray(files) ? files : [files];
        filesArr.forEach(async (file, i) => {
          const type = file.type.startsWith('image/') ? 'PHOTO' : 'VIDEO';
          const extension = file.type.split('/')[1];
          const filePath = `./uploads/${
            user.id
          }-${Date.now()}-${i}-${type.toLocaleLowerCase()}.${extension}`;
          savedFiles.push({
            type,
            url: filePath,
          });

          await writeFile(
            `./public/${filePath}`,
            Buffer.from(await file.arrayBuffer())
          );
          if (i === filesArr.length - 1) resolve();
        });
      });
    }

    const res = await prisma.post.create({
      data: {
        content: (content || '') as string,
        ...(files !== undefined && {
          visualMedia: {
            create: savedFiles.map((file) => ({
              type: file.type,
              url: file.url,
              user: {
                connect: {
                  id: user.id,
                },
              },
            })),
          },
        }),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        visualMedia: true,
      },
    });

    console.log(res);
    return NextResponse.json({ id: res.id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating post.' },
      { status: 500 }
    );
  }
}
