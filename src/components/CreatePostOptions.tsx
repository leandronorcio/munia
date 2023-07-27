'use client';

import { EmojiHappySmile, Image } from '@/svg_components';
import { forwardRef } from 'react';

export const CreatePostOptions = forwardRef<
  HTMLInputElement,
  {
    handleVisualMediaChange: React.ChangeEventHandler<HTMLInputElement>;
  }
>(({ handleVisualMediaChange }, ref) => {
  return (
    <div className="flex flex-row justify-center gap-6 px-4 pb-5 sm:justify-start">
      <label className="group flex cursor-pointer flex-row items-center gap-4">
        <Image fill="black" width={24} height={24} />
        <p className="text-base font-semibold text-gray-500 group-hover:text-black">
          Image / Video
        </p>
        <input
          ref={ref}
          type="file"
          className="hidden"
          name="visualMedia"
          onChange={handleVisualMediaChange}
          accept="video/*,.jpg,.jpeg,.png"
          multiple
        />
      </label>
      <label className="group flex cursor-pointer flex-row items-center gap-4">
        <EmojiHappySmile stroke="black" width={24} height={24} />
        <p className="text-base font-semibold text-gray-500 group-hover:text-black">
          Mood
        </p>
      </label>
    </div>
  );
});
