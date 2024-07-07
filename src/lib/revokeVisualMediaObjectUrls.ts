import { GetVisualMedia } from '@/types/definitions';

export function revokeVisualMediaObjectUrls(visualMedia: GetVisualMedia[]) {
  visualMedia.forEach(({ url }) => {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
  });
}
