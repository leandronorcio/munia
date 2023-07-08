import { memo } from 'react';
import PostVisualMedia from './PostVisualMedia';
import { cn } from '@/lib/cn';
import { isOdd } from '@/lib/isOdd';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { VisualMedia } from 'types';

const PostVisualMediaContainer = memo(
  function PostVisualMediaContainer({
    visualMedia,
  }: {
    visualMedia: VisualMedia[];
  }) {
    const { showVisualMediaModal } = useVisualMediaModal();
    const len = visualMedia.length;

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
  },
  (oldProps, newProps) => {
    const oldFiles = oldProps.visualMedia;
    const newFiles = newProps.visualMedia;

    if (oldFiles.length !== newFiles.length) return false;

    for (let i = 0; i < oldFiles.length; i++) {
      const oldFile = oldFiles[i];
      const newFile = newFiles[i];

      if (oldFile.type !== newFile.type) return false;
      if (oldFile.url !== newFile.url) return false;
    }
    return true;
  }
);

export default PostVisualMediaContainer;
