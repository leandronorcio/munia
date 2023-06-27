'use client';
import ProfilePhoto from './ui/ProfilePhoto';
import { Heart, ShareBack } from '@/svg_components';
import TextArea from './ui/TextArea';
import Button from './ui/Button';
import SvgComment from '@/svg_components/Comment';
import ProfileBlock from './ProfileBlock';
import Comment from './Comment';
import PostVisualMediaContainer from './PostVisualMediaContainer';
import { memo } from 'react';
import { areObjectsEqual } from '@/lib/areObjectsEqual';
import { sortVisualMedia } from '@/lib/sortVisualMedia';

export const Post = memo(
  function Post({
    id,
    content,
    createdAt,
    user,
    visualMedia,
    _count,
  }: PostType) {
    console.log('rerendered');
    return (
      <>
        <div className="rounded-2xl bg-slate-50 overflow-hidden">
          <div className="px-4 py-4 sm:px-8 sm:py-6">
            <ProfileBlock name={user.name!} photoUrl={user.profilePhoto!} />
          </div>
          <PostVisualMediaContainer
            visualMedia={sortVisualMedia(visualMedia)}
          />
          <div className="px-8 py-4">
            <p className="text-lg text-gray-700 mb-8">{content}</p>
            <div className="flex justify-start gap-6">
              <div className="flex items-center gap-3 cursor-pointer">
                <Heart stroke="black" width={24} height={24} />
                <p className="font-semibold text-lg text-gray-700 hidden sm:block">
                  {_count.postLikes} Likes
                </p>
              </div>
              <div className="flex items-center gap-3 cursor-pointer">
                <SvgComment stroke="black" width={24} height={24} />
                <p className="font-semibold text-lg text-gray-700 hidden sm:block">
                  {_count.comments} Comments
                </p>
              </div>
            </div>
          </div>

          {/* <div className="flex flex-col gap-3 px-8 py-6">
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
        </div> */}
        </div>
      </>
    );
  },
  (oldProps, newProps) => areObjectsEqual(oldProps, newProps)
);
