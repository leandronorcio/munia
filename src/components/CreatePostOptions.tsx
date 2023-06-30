'use client';

import { EmojiHappySmile, Image } from '@/svg_components';

export default function CreatePostOptions({
  handleVisualMediaChange,
}: {
  handleVisualMediaChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex flex-row gap-6 justify-center sm:justify-start px-4">
      <label className="flex flex-row items-center gap-4 cursor-pointer group">
        <Image fill="black" width={24} height={24} />
        <p className="text-gray-500 group-hover:text-black font-semibold text-base">
          Image / Video
        </p>
        <input
          type="file"
          className="hidden"
          name="visualMedia"
          onChange={handleVisualMediaChange}
          accept="video/*,.jpg,.jpeg,.png"
          multiple
        />
      </label>
      <label className="flex flex-row items-center gap-4 cursor-pointer group">
        <EmojiHappySmile stroke="black" width={24} height={24} />
        <p className="text-gray-500 group-hover:text-black font-semibold text-base">
          Mood
        </p>
      </label>
    </div>
  );
}
