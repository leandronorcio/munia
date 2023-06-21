import { useContext } from 'react';
import PostVisualMedia from './PostVisualMedia';
import { VisualMediaModalContext } from '@/contexts/VisualMediaModalContext';
import { cn } from '@/lib/cn';
import { isOdd } from '@/lib/isOdd';

export default function PostVisualMediaContainer({
  visualMedia,
}: {
  visualMedia: VisualMedia[];
}) {
  const { showVisualMediaModal } = useContext(VisualMediaModalContext);
  const len = visualMedia.length;
  console.log('PostVisualMediaContainer rendered');
  return (
    <div
      className={cn('grid relative', len > 2 ? 'grid-cols-2' : 'grid-cols-1')}
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
        <p className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-5xl text-white font-semibold">
          +{len - 4}
        </p>
      )}
    </div>
  );
}
