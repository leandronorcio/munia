import { VisualMedia } from 'types';

export function sortVisualMedia(visualMedia: VisualMedia[]) {
  function getOrder(item: string) {
    // Extract the number before "-photo"/"-video"
    // Ex. file path: http://localhost:3000/uploads/clilwgdr00002xylvrkxq87r9-1687845484085-1-photo.jpeg
    const arr = item.split('/');
    const fileNameOnly = arr[arr.length - 1];
    const number = fileNameOnly.split('-')[2];
    return parseInt(number, 10);
  }

  return visualMedia.sort((a, b) => getOrder(a['url']) - getOrder(b['url']));
}
