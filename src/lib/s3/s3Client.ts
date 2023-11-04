import 'server-only';
import { S3Client } from '@aws-sdk/client-s3';

// https://github.com/aws/aws-sdk-net/issues/1713
export const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
});
