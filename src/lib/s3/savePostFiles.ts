import { VisualMediaType } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { uploadObject } from '@/lib/s3/uploadObject';
import { Blob } from 'buffer';

/**
 * Use this function to efficiently save multiple files of a post.
 * If it encounters a `Blob`, it saves it to S3.
 * If it encounters a URL, it will return that URL instead of re-saving it.
 */
export async function savePostFiles(files: (Blob | string)[]) {
  // Create an array of promises
  const uploadPromises: Promise<{
    type: VisualMediaType;
    fileName: string;
  }>[] = files.map(async (file) => {
    if (typeof file === 'string') {
      // Return right away if given a URL
      const fileName = file.split('/').pop()!;
      const type: VisualMediaType = /\.(jpg|jpeg|png)$/i.test(fileName) ? 'PHOTO' : 'VIDEO';
      return {
        type,
        fileName,
      };
    }

    // If the item is Blob, save it to S3 and return the `type` and the `fileName`
    const type: VisualMediaType = file.type.startsWith('image/') ? 'PHOTO' : 'VIDEO';
    const fileExtension = file.type.split('/')[1];
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${uuid()}.${fileExtension}`;
    await uploadObject(buffer, fileName, fileExtension);

    return { type, fileName };
  });

  // Wait for all promises to finish
  return Promise.all(uploadPromises);
}
