'use client';

import { GetVisualMedia } from '@/types/definitions';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { GalleryItem } from './GalleryItem';

export function Gallery({ visualMedia }: { visualMedia: GetVisualMedia[] }) {
  const { showVisualMediaModal } = useVisualMediaModal();

  const openVisualMediaModal = (initialSlide: number) => () => {
    showVisualMediaModal({ visualMedia, initialSlide });
  };

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
      {visualMedia.map(({ type, url }, i) => (
        <GalleryItem key={url} type={type} url={url} onClick={openVisualMediaModal(i)} />
      ))}
    </div>
  );
}
