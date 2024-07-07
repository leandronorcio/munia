import 'server-only';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client';

export async function uploadObject(file: Buffer, fileName: string, type: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: type,
  });

  await s3Client.send(command);
}
