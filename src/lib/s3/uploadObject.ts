import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('env/dev.env') });

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadObject(buffer: Buffer, fileName: string, fileExtension: string) {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: fileName,
        Body: buffer,
        ContentType: `image/${fileExtension}`,
      }),
    );

    console.log('✔ Uploaded to AWS S3:', fileName);
    return true;
  } catch (error) {
    console.error('❌ S3 Upload failed:', error);
    throw error;
  }
}
