import 'server-only';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client';

export async function deleteObject(fileName: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
  });

  await s3Client.send(command);
}
