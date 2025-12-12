import { cn } from '@/lib/cn';
import { Play } from '@/svg_components';
import { mergeProps, useFocusRing, usePress } from 'react-aria';

// Define the VisualMediaType locally to match your Prisma enum
export type VisualMediaType = 'PHOTO' | 'VIDEO';

interface GalleryItemProps {
  type: VisualMediaType;
  url: string;
  onClick: () => void;
}

export function GalleryItem({ type, url, onClick }: GalleryItemProps) {
  const { pressProps, isPressed } = usePress({
    onPress: onClick,
  });
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      {...mergeProps(pressProps, focusProps)}
      role="button"
      tabIndex={0}
      aria-label="Open visual media"
      className={cn('group relative focus:outline-none', isFocusVisible && 'border-4 border-violet-500')}>
      {type === 'PHOTO' ? (
        <img src={url} className={cn('h-full w-full object-cover', isPressed && 'brightness-75')} alt="Gallery" />
      ) : (
        <>
          <Play
            width={36}
            height={36}
            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] stroke-violet-100 transition-transform group-hover:scale-125"
          />
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video className="h-full w-full object-cover">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}
    </div>
  );
}
