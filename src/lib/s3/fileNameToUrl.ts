import 'server-only';
/**
 * The database only stores the `fileName` of the files (image/video),
 * use this function to get the full S3 URL of the file.
 *
 * @param fileName The filename of the image or video.
 * @returns The full URL of the image or video.
 */
export function fileNameToUrl(fileName: string | null) {
  if (!fileName) return null;
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
