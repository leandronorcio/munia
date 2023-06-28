'use client';
import { Heart } from '@/svg_components';
import ProfileBlock from './ProfileBlock';
import PostVisualMediaContainer from './PostVisualMediaContainer';
import { memo, useContext, useState } from 'react';
import { areObjectsEqual } from '@/lib/areObjectsEqual';
import { sortVisualMedia } from '@/lib/sortVisualMedia';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/cn';
import { ToastContext } from '@/contexts/ToastContext';
import { DropdownItem } from './ui/DropdownItem';
import { DropdownMenu } from './ui/DropdownMenu';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { BasicDialogsContext } from '@/contexts/BasicDialogsContext';
import SvgComment from '@/svg_components/Comment';
import { Comments } from './Comments';

export const Post = memo(
  function Post({
    id: postId,
    content,
    createdAt,
    user,
    visualMedia,
    postLikes,
    _count,
    setPosts,
  }: PostType & {
    setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
  }) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    // The postLikes prop contains zero or one item i.e. the <PostLike>'s id.
    const [likedId, setLikedId] = useState(postLikes[0]?.id || 0);
    // The numberOfLikes is not real-time, it only reacts to likePost and unLikePost.
    const [numberOfLikes, setNumberOfLikes] = useState(_count.postLikes);
    const [numberOfComments, setNumberOfComments] = useState(_count.comments);
    const { toastify } = useContext(ToastContext);
    const { confirm } = useContext(BasicDialogsContext);

    const likePost = async () => {
      const res = await fetch(`/api/users/${userId}/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLikedId(data.id);
        setNumberOfLikes((prev) => prev + 1);
      } else {
        toastify({ title: 'Unable To Like', type: 'error' });
      }
    };

    const unlikePost = async () => {
      const res = await fetch(
        `/api/users/${userId}/posts/${postId}/likes/${likedId}`,
        {
          method: 'DELETE',
        }
      );

      if (res.ok) {
        setLikedId(0);
        setNumberOfLikes((prev) => prev - 1);
      } else {
        toastify({ title: 'Unable To Unlike', type: 'error' });
      }
    };

    const deletePost = async () => {
      const res = await fetch(`/api/users/${userId}/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        toastify({ title: 'Successfully Deleted', type: 'success' });
      } else {
        toastify({ title: 'Unable to Delete', type: 'error' });
      }
    };

    return (
      <>
        <div className="rounded-2xl bg-slate-50 ">
          <div className="flex justify-between items-center px-4 py-4 sm:px-8 sm:py-6">
            <ProfileBlock
              name={user.name!}
              time={formatDistanceStrict(new Date(createdAt), new Date())}
              photoUrl={user.profilePhoto!}
            />
            <DropdownMenu>
              <DropdownItem
                onClick={() =>
                  confirm({
                    title: 'Delete Post',
                    message: 'Do you really wish to delete this post?',
                    actionOnConfirm: deletePost,
                  })
                }
              >
                Delete Post
              </DropdownItem>
            </DropdownMenu>
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

          <Comments postId={postId} />
        </div>
      </>
    );
  },
  (oldProps, newProps) => areObjectsEqual(oldProps, newProps)
);
