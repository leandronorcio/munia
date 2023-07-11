import { selectPost } from '@/app/api/users/[userId]/posts/selectPost';
import { listOfKeyValuesToObject } from '@/lib/listOfKeyValuesToObject';
import prisma from '@/lib/prisma';
import { unlink, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { CustomUser, VisualMedia, PostType } from 'types';
import { Blob } from 'buffer';
import * as z from 'zod';
import { isValidFileType } from '@/lib/isValidFileType';

const writePostSchema = z
  .object({
    content: z.string().optional(),
    files: z
      .union([z.instanceof(Blob), z.array(z.instanceof(Blob))])
      .optional(),
  })
  .refine((data) => data.content !== undefined || data.files !== undefined, {
    message: "Either 'content' or 'files' must be defined",
  });

export async function useWritePost({
  formData,
  user,
  type,
  postId,
}: {
  formData: FormData;
  user: CustomUser;
  type: 'create' | 'edit';
  postId?: number;
}) {
  try {
    const body = writePostSchema.parse(listOfKeyValuesToObject(formData));
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
          const filePath = `/uploads/${
            user.id
          }-${Date.now()}-${i}-${type.toLocaleLowerCase()}.${extension}`;
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
        select: selectPost(user.id),
      });

      return NextResponse.json<PostType>({ ...res });
    } else if (type === 'edit') {
      // Delete the associated visualMedia files from the filesystem before updating.
      const post = await prisma.post.findFirst({
        select: {
          visualMedia: true,
        },
        where: {
          AND: [{ id: postId }, { userId: user.id }],
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
          id_userId: {
            id: postId!,
            userId: user.id,
          },
        },
        data: {
          visualMedia: {
            deleteMany: {},
          },
        },
      });

      const res = await prisma.post.update({
        where: {
          id_userId: {
            id: postId!,
            userId: user.id,
          },
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
                    id: user.id,
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
        select: selectPost(user.id),
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
