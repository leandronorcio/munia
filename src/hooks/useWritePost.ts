import { selectPost } from '@/lib/prisma/selectPost';
import { listOfKeyValuesToObject } from '@/lib/listOfKeyValuesToObject';
import prisma from '@/lib/prisma/prisma';
import { unlink, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { VisualMedia, GetPost } from 'types';
import { isValidFileType } from '@/lib/isValidFileType';
import { postWriteSchema } from '@/lib/validations/post';
import { z } from 'zod';
import { toGetPost } from '@/lib/prisma/toGetPost';
import { getServerUser } from '@/lib/getServerUser';
import { convertMentionUsernamesToIds } from '@/lib/convertMentionUsernamesToIds';

export async function useWritePost({
  formData,
  type,
  postId,
}: {
  formData: FormData;
  type: 'create' | 'edit';
  postId?: number;
}) {
  const [user] = await getServerUser();
  const userId = user?.id!;

  try {
    const body = postWriteSchema.parse(listOfKeyValuesToObject(formData));
    const { content, files } = body;
    const contentWithIdMentions = content
      ? await convertMentionUsernamesToIds({ str: content })
      : '';
    const savedFiles: VisualMedia[] = [];

    if (files) {
      // Wrap process of saving the files in a promise to wait for the files to be saved before continuing
      await new Promise<void>((resolve) => {
        // Convert 'files' field to an array if it is not
        const filesArr = Array.isArray(files) ? files : [files];

        filesArr.forEach(async (file, i) => {
          const type = file.type.startsWith('image/') ? 'PHOTO' : 'VIDEO';

          // Respond with an error is the user uploaded an unsupported file
          const extension = file.type.split('/')[1];
          if (!isValidFileType(extension)) {
            return NextResponse.json(
              { error: 'Invalid file type.' },
              { status: 415 },
            );
          }

          // This `filePath` is what will be recorded in the data base
          const filePath = `/uploads/${userId}-${Date.now()}-${i}-${type.toLocaleLowerCase()}.${extension}`;
          savedFiles.push({
            type,
            url: filePath,
          });

          await writeFile(
            `./public${filePath}`,
            Buffer.from(await file.arrayBuffer()),
          );

          // Only resolve when the last file is saved.
          if (i === filesArr.length - 1) resolve();
        });
      });
    }

    if (type === 'create') {
      const res = await prisma.post.create({
        data: {
          content: contentWithIdMentions as string,
          ...(files !== undefined && {
            visualMedia: {
              create: savedFiles.map((file) => ({
                type: file.type,
                url: file.url,
                userId,
              })),
            },
          }),
          userId,
        },
        select: selectPost(userId),
      });

      return NextResponse.json<GetPost>(await toGetPost(res));
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
          content: contentWithIdMentions as string,
          ...(files !== undefined && {
            visualMedia: {
              create: savedFiles.map((file) => ({
                type: file.type,
                url: file.url,
                userId,
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

      return NextResponse.json<GetPost>(await toGetPost(res));
    }
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 });
    }

    return NextResponse.json(
      { error: 'Error creating post.' },
      { status: 500 },
    );
  }
}
