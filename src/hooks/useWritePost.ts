import { listOfKeyValuesToObject } from '@/lib/listOfKeyValuesToObject';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';

export async function useWritePost({
  formData,
  userId,
  type,
  postId,
}: {
  formData: FormData;
  userId: string;
  type: 'create' | 'edit';
  postId?: number;
}) {
  const body = listOfKeyValuesToObject(formData) as PostPOSTRequestBody;
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
          const filePath = `./uploads/${userId}-${Date.now()}-${i}-${type.toLocaleLowerCase()}.${extension}`;
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

    if (type === 'create') {
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
                    id: userId,
                  },
                },
              })),
            },
          }),
          user: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          visualMedia: true,
        },
      });

      console.log(res);
      return NextResponse.json({ id: res.id });
    } else if (type === 'edit') {
      const res = await prisma.post.update({
        data: {
          content: (content || '') as string,
          ...(files !== undefined && {
            visualMedia: {
              create: savedFiles.map((file) => ({
                type: file.type,
                url: file.url,
                user: {
                  connect: {
                    id: userId,
                  },
                },
              })),
            },
          }),
        },
        where: {
          id: postId,
        },
      });

      console.log(res);
      return NextResponse.json({ id: res.id });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Error creating post.' },
      { status: 500 }
    );
  }
}
