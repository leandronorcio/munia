import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Use project-root-relative path
const envPath = path.resolve('env/dev.env');

console.log('Looking for env file at:', envPath);
console.log('Exists?', fs.existsSync(envPath));

dotenv.config({ path: envPath });

// Check variables
console.log('NODE_ENV:', process.env.NODE_ENV ?? '❌ Missing');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL ?? '❌ Missing');
console.log('AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET ?? '❌ Missing');
console.log('AWS_REGION:', process.env.AWS_REGION ?? '❌ Missing');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ?? '❌ Missing');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ?? '❌ Missing');
