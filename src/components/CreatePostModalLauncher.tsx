'use client';

import { useCreatePostModal } from '@/hooks/useCreatePostModal';
import SvgImage from '@/svg_components/Image';
import { useCallback } from 'react';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import { ButtonNaked } from './ui/ButtonNaked';

export function CreatePostModalLauncher() {
  const { launchCreatePost } = useCreatePostModal();
  const launcCreatePostFinderClosed = useCallback(() => launchCreatePost({}), [launchCreatePost]);
  const launchCreatePostFinderOpened = useCallback(() => {
    launchCreatePost({
      shouldOpenFileInputOnMount: true,
    });
  }, [launchCreatePost]);

  return (
    <div className="rounded-xl bg-card px-4 py-4 shadow sm:px-8 sm:py-5">
      <div className="mb-[18px] flex flex-row">
        <div className="mr-3 h-12 w-12">
          <ProfilePhotoOwn />
        </div>
        <ButtonNaked onPress={launcCreatePostFinderClosed} className="flex flex-grow flex-col justify-center">
          <p className="text-muted-foreground/70">What&apos;s on your mind?</p>
        </ButtonNaked>
      </div>
      <div className="flex flex-row gap-4">
        <ButtonNaked
          onPress={launchCreatePostFinderOpened}
          className="group flex cursor-pointer flex-row items-center gap-4">
          <SvgImage className="h-6 w-6 text-muted-foreground" />
          <p className="text-base font-semibold text-muted-foreground group-hover:text-muted-foreground/80">
            Image / Video
          </p>
        </ButtonNaked>
        {/* <ButtonNaked className="group flex cursor-pointer flex-row items-center gap-4">
          <EmojiHappySmile stroke="black" width={24} height={24} />
          <p className="text-base font-semibold text-gray-500 group-hover:text-black">
            Mood
          </p>
        </ButtonNaked> */}
      </div>
    </div>
  );
}
