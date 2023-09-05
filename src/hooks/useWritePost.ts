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
import { v4 as uuid } from 'uuid';
import { uploadObject } from '@/lib/s3/uploadObject';
import { deleteObject } from '@/lib/s3/deleteObject';
import { VisualMediaType } from '@prisma/client';

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
      if (!isValidFileType(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type.' },
          { status: 415 },
        );
      }
    }

    // Make an array of promises that uploads each file and returns the `type` and `fileName`
    const uploadPromises: Promise<{
      type: VisualMediaType;
      fileName: string;
    }>[] = filesArr.map(async (file) => {
      const type: VisualMediaType = file.type.startsWith('image/')
        ? 'PHOTO'
        : 'VIDEO';

      // Upload the file to S3
      const fileExtension = file.type.split('/')[1];
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${uuid()}.${fileExtension}`;
      await uploadObject(buffer, fileName, fileExtension);

      return { type, fileName };
    });

    // Wait for all promises to finish
    const savedFiles = await Promise.all(uploadPromises);

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
      // Delete the associated visualMedia files from the S3 bucket
      const post = await prisma.post.findFirst({
        select: {
          visualMedia: true,
        },
        where: {
          AND: [{ id: postId }, { userId: userId }],
        },
      });

      if (post !== null) {
        if (post.visualMedia.length > 0) {
          for (const { fileName } of post.visualMedia) {
            await deleteObject(fileName);
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
