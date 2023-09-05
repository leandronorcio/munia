import { VisualMediaType } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { uploadObject } from '@/lib/s3/uploadObject';
import { Blob } from 'buffer';

export async function saveFiles(files: Blob[]) {
  // Make an array of promises that uploads each file and returns the `type` and `fileName`
  const uploadPromises: Promise<{
    type: VisualMediaType;
    fileName: string;
  }>[] = files.map(async (file) => {
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
  return await Promise.all(uploadPromises);
}
