import { cn } from '@/lib/cn';
import { Play } from '@/svg_components';
import { VisualMediaType } from '@prisma/client';

export default function PostVisualMedia({
  type,
  url,
  onClick,
  height,
  colSpan,
}: {
  type: VisualMediaType;
  url: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  height: string;
  colSpan: number;
}) {
  return (
    <div
      className={cn(
        'group relative cursor-pointer overflow-hidden',
        colSpan === 1 ? 'col-span-1' : 'col-span-2',
      )}
      onClick={onClick}
      style={{
        height,
      }}
    >
      {type === 'PHOTO' ? (
        <img
          src={url}
          className="h-full w-full object-cover transition-transform hover:scale-110"
        />
      ) : (
        <>
          <Play
            width={72}
            height={72}
            className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] stroke-violet-100 transition-transform group-hover:scale-125"
          />
          <video className="h-full w-full object-cover">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}
    </div>
  );
}
