import 'server-only';

import { selectPost } from '@/lib/prisma/selectPost';
import { formDataToObject } from '@/lib/formDataToObject';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { GetPost } from 'types';
import { isValidFileType } from '@/lib/isValidFileType';
import { postWriteSchema } from '@/lib/validations/post';
import { z } from 'zod';
import { toGetPost } from '@/lib/prisma/toGetPost';
import { getServerUser } from '@/lib/getServerUser';
import { convertMentionUsernamesToIds } from '@/lib/convertMentionUsernamesToIds';
import { mentionsActivityLogger } from '@/lib/mentionsActivityLogger';
import { deleteObject } from '@/lib/s3/deleteObject';
import { savePostFiles } from '@/lib/s3/savePostFiles';

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
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  try {
    const body = postWriteSchema.parse(formDataToObject(formData));

    const { content, files } = body;
    const { str, usersMentioned } = await convertMentionUsernamesToIds({
      str: content || '',
    });
    const filesArr = !files ? [] : Array.isArray(files) ? files : [files];

    // Validate if files are valid
    for (const file of filesArr) {
      if (typeof file === 'string') continue;
      if (!isValidFileType(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type.' },
          { status: 415 },
        );
      }
    }
    const savedFiles = await savePostFiles(filesArr);

    if (type === 'create') {
      const res = await prisma.post.create({
        data: {
          content: str,
          ...(files !== undefined && {
            visualMedia: {
              create: savedFiles.map(({ type, fileName }) => ({
                type,
                fileName,
                userId,
              })),
            },
          }),
          userId,
        },
        select: selectPost(userId),
      });

      // Log the 'POST_MENTION' activity if applicable
      await mentionsActivityLogger({
        usersMentioned,
        activity: {
          type: 'POST_MENTION',
          sourceUserId: userId,
          sourceId: res.id,
        },
        isUpdate: false,
      });

      return NextResponse.json<GetPost>(await toGetPost(res));
    } else if (type === 'edit') {
      const post = await prisma.post.findFirst({
        where: {
          id: postId,
        },
        select: {
          visualMedia: true,
        },
      });

      // If there are previously associated `visuaMedia` files
      if (post && post.visualMedia.length > 0) {
        // Delete files that are no longer needed from the S3 bucket
        const savedFileNames = savedFiles.map(({ fileName }) => fileName);
        const filesToDelete = post.visualMedia.filter(
          // If the `fileName` is not included in `savedFileNames`, it must be deleted
          ({ fileName }) => !savedFileNames.includes(fileName),
        );
        for (const { fileName } of filesToDelete) {
          await deleteObject(fileName);
        }

        // Delete the related `visuaMedia` record to avoid duplicating the records
        // as the next step will write the `savedFiles` into the `post`
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
      }

      const res = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          content: str,
          ...(files !== undefined && {
            visualMedia: {
              create: savedFiles.map(({ type, fileName }) => ({
                type,
                fileName,
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

      // Log the 'POST_MENTION' activity if applicable
      await mentionsActivityLogger({
        usersMentioned,
        activity: {
          type: 'POST_MENTION',
          sourceUserId: userId,
          sourceId: res.id,
        },
        isUpdate: true,
      });

      return NextResponse.json<GetPost>(await toGetPost(res));
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return NextResponse.json(null, {
        status: 422,
        statusText: error.issues[0].message,
      });
    }

    return NextResponse.json(
      { error: 'Error creating post.' },
      { status: 500 },
    );
  }
}
