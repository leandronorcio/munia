import { cn } from '@/lib/cn';
import { isOdd } from '@/lib/isOdd';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { GetVisualMedia } from '@/types/definitions';
import { useCallback } from 'react';
import { PostVisualMedia } from './PostVisualMedia';

export function PostVisualMediaContainer({ visualMedia }: { visualMedia: GetVisualMedia[] }) {
  const { showVisualMediaModal } = useVisualMediaModal();
  const numOfVisualMedia = visualMedia.length;
  const onClick = useCallback(
    (initialSlide: number) => () => {
      showVisualMediaModal({ visualMedia, initialSlide });
    },
    [showVisualMediaModal, visualMedia],
  );

  return (
    <div className={cn('relative grid', numOfVisualMedia > 2 ? 'grid-cols-2' : 'grid-cols-1')}>
      {numOfVisualMedia > 0 &&
        visualMedia.map((item, i) => {
          // Only display four images.
          if (i > 3) return false;
          return (
            <PostVisualMedia
              key={item.url}
              type={item.type}
              url={item.url}
              height={numOfVisualMedia > 1 ? '300px' : '480px'}
              // If odd and numOfVisualMedia is < 4, the first image must take the full width.
              colSpan={isOdd(numOfVisualMedia) && numOfVisualMedia < 4 && i === 0 ? 2 : 1}
              onClick={onClick(i)}
            />
          );
        })}
      {numOfVisualMedia > 4 && (
        <p className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-5xl font-semibold text-white">
          +{numOfVisualMedia - 4}
        </p>
      )}
    </div>
  );
}
