import { selectPost } from '@/lib/prisma/selectPost';
import { listOfKeyValuesToObject } from '@/lib/listOfKeyValuesToObject';
import prisma from '@/lib/prisma/prisma';
import { unlink, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { VisualMedia, PostType } from 'types';
import { isValidFileType } from '@/lib/isValidFileType';
import { postWriteSchema } from '@/lib/validations/post';
import { z } from 'zod';
import { useProtectApiRoute } from './useProtectApiRoute';

export async function useWritePost({
  formData,
  type,
  postId,
}: {
  formData: FormData;
  type: 'create' | 'edit';
  postId?: number;
}) {
  const [user] = await useProtectApiRoute();
  const userId = user?.id!;
  try {
    const body = postWriteSchema.parse(listOfKeyValuesToObject(formData));
    const { content, files } = body;
    const savedFiles: VisualMedia[] = [];

    if (files) {
      await new Promise<void>((resolve) => {
        // Convert 'files' field to an array if it is not.
        const filesArr = Array.isArray(files) ? files : [files];
        filesArr.forEach(async (file, i) => {
          const type = file.type.startsWith('image/') ? 'PHOTO' : 'VIDEO';
          const extension = file.type.split('/')[1];
          if (!isValidFileType(extension)) {
            return NextResponse.json(
              { error: 'Invalid file type.' },
              { status: 415 }
            );
          }
          const filePath = `/uploads/${userId}-${Date.now()}-${i}-${type.toLocaleLowerCase()}.${extension}`;
          savedFiles.push({
            type,
            url: filePath,
          });

          await writeFile(
            `./public${filePath}`,
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
        select: selectPost(userId),
      });

      return NextResponse.json<PostType>({ ...res });
    } else if (type === 'edit') {
      // Delete the associated visualMedia files from the filesystem before updating.
      const post = await prisma.post.findFirst({
        select: {
          visualMedia: true,
        },
        where: {
          AND: [{ id: postId }, { userId: userId }],
        },
      });

      if (post != null) {
        if (post.visualMedia.length > 0) {
          for (const file of post.visualMedia) {
            await unlink(`./public/${file.url}`);
          }
        }
      }

      // Delete the visualMedia records from the database.
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          visualMedia: {
            deleteMany: {},
          },
        },
      });

      const res = await prisma.post.update({
        where: {
          id: postId,
        },

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
          ...(files === undefined && {
            visualMedia: {
              deleteMany: {},
            },
          }),
        },
        select: selectPost(userId),
      });

      return NextResponse.json<PostType>({ ...res });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }
    return NextResponse.json(
      { error: 'Error creating post.' },
      { status: 500 }
    );
  }
}
