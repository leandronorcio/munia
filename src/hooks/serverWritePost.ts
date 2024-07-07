import { selectPost } from '@/lib/prisma/selectPost';
import { formDataToObject } from '@/lib/formDataToObject';
import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { GetPost } from '@/types/definitions';
import { isValidFileType } from '@/lib/isValidFileType';
import { postWriteSchema } from '@/lib/validations/post';
import { z } from 'zod';
import { toGetPost } from '@/lib/prisma/toGetPost';
import { getServerUser } from '@/lib/getServerUser';
import { convertMentionUsernamesToIds } from '@/lib/convertMentionUsernamesToIds';
import { mentionsActivityLogger } from '@/lib/mentionsActivityLogger';
import { deleteObject } from '@/lib/s3/deleteObject';
import { savePostFiles } from '@/lib/s3/savePostFiles';
import { verifyAccessToPost } from '@/app/api/posts/[postId]/verifyAccessToPost';

// If `type` is `edit`, then the `postId` is required
type Props =
  | {
      formData: FormData;
      type: 'create';
      postId?: undefined;
    }
  | {
      formData: FormData;
      type: 'edit';
      postId: number;
    };

export async function serverWritePost({ formData, type, postId }: Props) {
  const [user] = await getServerUser();
  if (!user) return NextResponse.json({}, { status: 401 });
  const userId = user.id;

  if (type === 'edit') {
    if (!verifyAccessToPost(postId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
  }

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
        return NextResponse.json({ error: 'Invalid file type.' }, { status: 415 });
      }
    }
    const savedFiles = await savePostFiles(filesArr);

    if (type === 'create') {
      const res = await prisma.post.create({
        data: {
          content: str,
          ...(files !== undefined && {
            visualMedia: {
              create: savedFiles.map((savedFile) => ({
                type: savedFile.type,
                fileName: savedFile.fileName,
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
    }

    // if (type === 'edit')
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
        // eslint-disable-next-line no-await-in-loop
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
            create: savedFiles.map((savedFile) => ({
              type: savedFile.type,
              fileName: savedFile.fileName,
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(null, {
        status: 422,
        statusText: error.issues[0].message,
      });
    }

    return NextResponse.json({ error: 'Error creating post.' }, { status: 500 });
  }
}
