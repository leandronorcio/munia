import { Play } from '@/svg_components';

export default function PostVisualMedia({
  type,
  url,
  onClick,
}: {
  type: 'photo' | 'video';
  url: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      className="w-1/2 max-h-[360px] cursor-pointer overflow-hidden relative"
      onClick={onClick}
    >
      {type === 'photo' ? (
        <img
          src={url}
          className="object-cover w-full h-full transition-transform hover:scale-110"
        />
      ) : (
        <>
          <Play
            stroke="white"
            width={48}
            height={48}
            className="absolute z-100 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
          />
          <video
            className="object-cover w-full h-full transition-transform hover:scale-110 z-10"
            style={{ transformStyle: 'flat' }}
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      )}
    </div>
  );
}
