import { EmojiHappySmile, Image } from '@/svg_components';
import ProfilePhoto from './ui/ProfilePhoto';
import { TextArea } from './ui/TextArea';
import { useCreatePost } from '@/hooks/useCreatePost';
import { CreatePostCallback } from '@/contexts/CreatePostModalContext';

export function CreatePostModalLauncher({
  onSuccess,
}: {
  onSuccess: CreatePostCallback;
}) {
  const { launchCreatePost } = useCreatePost();
  return (
    <div className="rounded-xl bg-white  px-4 py-4 sm:px-8 sm:py-6">
      <div className="flex flex-row mb-[18px]">
        <div className="w-12 h-12">
          <ProfilePhoto />
        </div>
        <div
          onClick={() => {
            launchCreatePost({ onSuccess });
          }}
          className="flex-grow flex flex-col justify-center"
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
              onSuccess,
              shouldOpenFileInputOnMount: true,
            });
          }}
          className="flex flex-row items-center gap-4 cursor-pointer group"
        >
          <Image fill="black" width={24} height={24} />
          <p className="text-gray-500 group-hover:text-black font-semibold text-base">
            Image / Video
          </p>
        </div>
        <div className="flex flex-row items-center gap-4 cursor-pointer group">
          <EmojiHappySmile stroke="black" width={24} height={24} />
          <p className="text-gray-500 group-hover:text-black font-semibold text-base">
            Mood
          </p>
        </div>
      </div>
    </div>
  );
}
