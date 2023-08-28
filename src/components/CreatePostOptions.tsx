'use client';

import { Image } from '@/svg_components';
import { forwardRef, useRef } from 'react';
import { ButtonNaked } from './ui/ButtonNaked';

export const CreatePostOptions = forwardRef<
  HTMLInputElement,
  {
    handleVisualMediaChange: React.ChangeEventHandler<HTMLInputElement>;
  }
>(({ handleVisualMediaChange }, forwardedRef) => {
  const localRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-row justify-center gap-6 px-4 pb-5 sm:justify-start">
      <ButtonNaked
        aria-label="Upload an image or video"
        className="flex gap-4"
        onPress={() => localRef.current?.click()}
      >
        <Image fill="black" width={24} height={24} />
        <p className="text-base font-semibold text-gray-500 group-hover:text-black">
          Image / Video
        </p>
      </ButtonNaked>
      <input
        ref={(node) => {
          // https://stackoverflow.com/a/62238917/8434369
          localRef.current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) forwardedRef.current = node;
        }}
        type="file"
        className="hidden"
        name="visualMedia"
        onChange={handleVisualMediaChange}
        accept="video/*,.jpg,.jpeg,.png"
        multiple
      />
    </div>
  );
});
