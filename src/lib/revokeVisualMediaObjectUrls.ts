import { GetVisualMedia } from 'types';

export function revokeVisualMediaObjectUrls(visualMedia: GetVisualMedia[]) {
  for (const { url } of visualMedia) {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
  }
}
