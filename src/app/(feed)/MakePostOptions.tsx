'use client';

import Button from '@/components/ui/Button';
import { EmojiHappySmile, Image, Video } from '@/svg_components';

export default function MakePostOptions() {
  return (
    <div className="flex flex-row gap-6">
      <div className="flex flex-row items-center gap-4 cursor-pointer group">
        <Video stroke="black" width={24} height={24} />
        <p className="text-gray-500 group-hover:text-black font-semibold text-base">
          Video
        </p>
      </div>
      <div className="flex flex-row items-center gap-4 cursor-pointer group">
        <Image fill="black" width={24} height={24} />
        <p className="text-gray-500 group-hover:text-black font-semibold text-base">
          Image
        </p>
      </div>
      <div className="flex flex-row items-center gap-4 cursor-pointer group">
        <EmojiHappySmile stroke="black" width={24} height={24} />
        <p className="text-gray-500 group-hover:text-black font-semibold text-base">
          Mood
        </p>
      </div>
      <div className="ml-auto">
        <Button mode="secondary" onClick={() => {}} size="small" disabled>
          Post
        </Button>
      </div>
    </div>
  );
}
