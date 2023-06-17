'use client';
import ProfilePhoto from './ui/ProfilePhoto';
import { Heart, ShareBack } from '@/svg_components';
import TextArea from './ui/TextArea';
import Button from './ui/Button';
import SvgComment from '@/svg_components/Comment';
import ProfileBlock from './ProfileBlock';
import Comment from './Comment';

export default function Post() {
  return (
    <div className="rounded-2xl bg-slate-50 overflow-hidden">
      <div className="px-4 py-4 sm:px-8 sm:py-6">
        <ProfileBlock />
      </div>
      <div className="bg-violet-50">
        <img
          src="/uploads/clilwgdr00002xylvrkxq87r9-1686749752730-profilePhoto.png"
          className="object-contain max-h-[480px] w-full"
        />
      </div>
      <div className="px-8 py-4">
        <p className="text-lg text-gray-700 mb-8">
          Lorem ipsum dolor sit amet.
        </p>
        <div className="flex justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <Heart stroke="black" width={24} height={24} />
            <p className="font-semibold text-lg text-gray-700 hidden sm:block">
              10 Likes
            </p>
          </div>
          <div className="flex items-center gap-3 cursor-pointer">
            <SvgComment stroke="black" width={24} height={24} />
            <p className="font-semibold text-lg text-gray-700 hidden sm:block">
              10 Comments
            </p>
          </div>
          <div className="flex items-center gap-3 cursor-pointer">
            <ShareBack stroke="black" width={24} height={24} />
            <p className="font-semibold text-lg text-gray-700 hidden sm:block">
              10 Shares
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-8 py-6">
        <Comment />
        <div className="flex flex-row ">
          <div className="w-11 h-11">
            <ProfilePhoto />
          </div>
          <div className="flex-grow flex flex-col justify-center">
            <TextArea placeholder="Write your comment here..." />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => {}} mode="secondary" size="small">
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
