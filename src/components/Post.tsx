'use client';
import { Heart } from '@/svg_components';
import SvgComment from '@/svg_components/Comment';
import ProfileBlock from './ProfileBlock';
import PostVisualMediaContainer from './PostVisualMediaContainer';
import { memo, useContext, useState } from 'react';
import { areObjectsEqual } from '@/lib/areObjectsEqual';
import { sortVisualMedia } from '@/lib/sortVisualMedia';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/cn';
import { ToastContext } from '@/contexts/ToastContext';

export const Post = memo(
  function Post({
    id,
    content,
    createdAt,
    user,
    visualMedia,
    postLikes,
    comments,
    _count,
  }: PostType) {
    const { data: session } = useSession();
    const sessionUserId = session?.user?.id;
    // The postLikes prop contains zero or one item i.e. the <PostLike>'s id.
    const [likedId, setLikedId] = useState(postLikes[0]?.id || 0);
    // The numberOfLikes is not real-time, it only reacts to likePost and unLikePost.
    const [numberOfLikes, setNumberOfLikes] = useState(_count.postLikes);
    const [numberOfComments, setNumberOfComments] = useState(_count.comments);
    const { toastify } = useContext(ToastContext);

    const likePost = async () => {
      const res = await fetch(`/api/users/${sessionUserId}/post-likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id } as PostLikePostRequestBody),
      });

      if (res.ok) {
        const data = await res.json();
        setLikedId(data.id);
        setNumberOfLikes((prev) => prev + 1);
      } else {
        toastify({ title: 'Unable to like.', type: 'error' });
      }
    };

    const unlikePost = async () => {
      const res = await fetch(
        `/api/users/${sessionUserId}/post-likes/${likedId}`,
        {
          method: 'DELETE',
        }
      );

      if (res.ok) {
        setLikedId(0);
        setNumberOfLikes((prev) => prev - 1);
      } else {
        toastify({ title: 'Unable to unlike.', type: 'error' });
      }
    };

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
                <div
                  onClick={() => {
                    likedId === 0 ? likePost() : unlikePost();
                  }}
                  className="p-2 group transition-transform hover:bg-pink-200 active:bg-pink-300 rounded-full"
                >
                  <Heart
                    width={24}
                    height={24}
                    className={cn(
                      'transition-transform group-hover:stroke-pink-500 group-active:rotate-45',
                      likedId !== 0 ? 'stroke-red-500' : 'stroke-black',
                      likedId !== 0 ? 'fill-red-500' : 'fill-none'
                    )}
                  />
                </div>
                <p className="font-semibold text-lg text-gray-700 hidden sm:block">
                  {numberOfLikes} {numberOfLikes === 1 ? 'Like' : 'Likes'}
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
