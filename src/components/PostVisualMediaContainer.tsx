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
        visualMedia.map((item, i) => (
          <PostVisualMedia
            key={i}
            type={item.type}
            url={item.url}
            onClick={() =>
              showVisualMediaModal({ visualMedia, initialSlide: i })
            }
          />
        ))}
    </div>
  );
}
