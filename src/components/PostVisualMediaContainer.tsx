import { useContext } from 'react';
import PostVisualMedia from './PostVisualMedia';
import { VisualMediaModalContext } from '@/contexts/VisualMediaModalContext';

export default function PostVisualMediaContainer({
  visualMedia,
}: {
  visualMedia: VisualMedia[];
}) {
  const { showVisualMediaModal } = useContext(VisualMediaModalContext);
  return (
    <div className="bg-violet-50 flex flex-wrap justify-center items-center">
      {visualMedia.length > 0 &&
        visualMedia.map((media, i) => (
          <PostVisualMedia
            key={i}
            type={media.type}
            url={media.url}
            onClick={() =>
              showVisualMediaModal({ visualMedia, initialSlide: i })
            }
          />
        ))}
    </div>
  );
}
