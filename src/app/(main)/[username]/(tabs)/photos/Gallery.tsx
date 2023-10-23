import { GetVisualMedia } from 'types';

export function Gallery({ visualMedia }: { visualMedia: GetVisualMedia[] }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
      {visualMedia.map((item) => (
        <div className="hov">
          <img className="h-full w-full object-cover" src={item.url} alt="" />
        </div>
      ))}
    </div>
  );
}
