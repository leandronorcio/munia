import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('env/dev.env') });

console.log('NODE_ENV:', process.env.NODE_ENV);

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const uploadFile = async (filePath: string) => {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error('❌ File not found:', resolvedPath);
    return;
  }

  const fileStream = fs.createReadStream(resolvedPath);

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: path.basename(resolvedPath),
        Body: fileStream,
      }),
    );
    console.log('✔ File uploaded to AWS S3!');
  } catch (err) {
    console.error('❌ Upload failed:', err);
  }
};

uploadFile('./sample.txt');
