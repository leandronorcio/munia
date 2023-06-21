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
        'cursor-pointer overflow-hidden relative group',
        colSpan === 1 ? 'col-span-1' : 'col-span-2'
      )}
      onClick={onClick}
      style={{
        height,
      }}
    >
      {type === 'PHOTO' ? (
        <img
          src={url}
          className="object-cover w-full h-full transition-transform hover:scale-110"
        />
      ) : (
        <>
          <Play
            width={72}
            height={72}
            className="stroke-violet-100 absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] transition-transform group-hover:scale-125"
          />
          <video className="object-cover w-full h-full">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}
    </div>
  );
}
