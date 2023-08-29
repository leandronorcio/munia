import { PostVisualMedia } from './PostVisualMedia';
import { cn } from '@/lib/cn';
import { isOdd } from '@/lib/isOdd';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { VisualMedia } from 'types';

export function PostVisualMediaContainer({
  visualMedia,
}: {
  visualMedia: VisualMedia[];
}) {
  console.log('rendered PostVisualMediaContainer');
  const { showVisualMediaModal } = useVisualMediaModal();
  const len = visualMedia.length;

  return (
    <div
      className={cn('relative grid', len > 2 ? 'grid-cols-2' : 'grid-cols-1')}
    >
      {visualMedia.length > 0 &&
        visualMedia.map((item, i) => {
          // Only display four images.
          if (i > 3) return false;
          return (
            <PostVisualMedia
              key={i}
              type={item.type}
              url={item.url}
              height={len > 1 ? '300px' : '480px'}
              // If odd and len is < 4, the first image must take the full width.
              colSpan={isOdd(len) && len < 4 && i === 0 ? 2 : 1}
              onClick={() =>
                showVisualMediaModal({ visualMedia, initialSlide: i })
              }
            />
          );
        })}
      {len > 4 && (
        <p className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-5xl font-semibold text-white">
          +{len - 4}
        </p>
      )}
    </div>
  );
}
