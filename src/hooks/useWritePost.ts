import { listOfKeyValuesToObject } from '@/lib/listOfKeyValuesToObject';
import prisma from '@/lib/prisma';
import { unlink, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';

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
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              profilePhoto: true,
            },
          },
          visualMedia: {
            select: {
              type: true,
              url: true,
            },
          },
          /**
           * Use postLikes to store the <PostLike>'s id of the user to the Post.
           * If there is a <PostLike> id, that means the user requesting has
           * liked the Post.
           */
          postLikes: {
            select: {
              id: true,
            },
            where: {
              userId: user.id,
            },
          },
          _count: {
            select: {
              postLikes: true,
              comments: true,
            },
          },
        },
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
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              profilePhoto: true,
            },
          },
          visualMedia: {
            select: {
              type: true,
              url: true,
            },
          },
          /**
           * Use postLikes to store the <PostLike>'s id of the user to the Post.
           * If there is a <PostLike> id, that means the user requesting has
           * liked the Post.
           */
          postLikes: {
            select: {
              id: true,
            },
            where: {
              userId: user.id,
            },
          },
          _count: {
            select: {
              postLikes: true,
              comments: true,
            },
          },
        },
      });

      console.log(res);
      return NextResponse.json<PostType>({ ...res });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Error creating post.' },
      { status: 500 }
    );
  }
}
