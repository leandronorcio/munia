'use client';
import { EmojiHappySmile, Image } from '@/svg_components';
import { TextArea } from './ui/TextArea';
import { useCreatePost } from '@/hooks/useCreatePost';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';

export function CreatePostModalLauncher() {
  const { launchCreatePost } = useCreatePost();
  return (
    <div className="rounded-xl bg-white px-4 py-4 shadow sm:px-8 sm:py-5">
      <div className="mb-[18px] flex flex-row">
        <div className="mr-3 h-12 w-12">
          <ProfilePhotoOwn />
        </div>
        <div
          onClick={() => {
            launchCreatePost({ shouldOpenFileInputOnMount: false });
          }}
          className="flex flex-grow flex-col justify-center"
        >
          <TextArea
            placeholder="What's on your mind?"
            className="cursor-pointer"
            disabled
          />
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div
          onClick={() => {
            launchCreatePost({
              shouldOpenFileInputOnMount: true,
            });
          }}
          className="group flex cursor-pointer flex-row items-center gap-4"
        >
          <Image fill="black" width={24} height={24} />
          <p className="text-base font-semibold text-gray-500 group-hover:text-black">
            Image / Video
          </p>
        </div>
        <div className="group flex cursor-pointer flex-row items-center gap-4">
          <EmojiHappySmile stroke="black" width={24} height={24} />
          <p className="text-base font-semibold text-gray-500 group-hover:text-black">
            Mood
          </p>
        </div>
      </div>
    </div>
  );
}
