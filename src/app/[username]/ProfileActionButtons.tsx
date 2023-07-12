'use client';
import Button from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { Mail } from '@/svg_components';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { GetUser } from 'types';

export function ProfileActionButtons({ profile }: { profile: GetUser }) {
  const { data: session } = useSession();
  const { id, isFollowing: initialIsFollowing } = profile;
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [hoveringFollowButton, setHoveringFollowButton] = useState(false);
  const { showToast } = useToast();

  const follow = async () => {
    const res = await fetch(`/api/users/${session?.user?.id}/following`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIdToFollow: id }),
    });

    if (res.ok) {
      setIsFollowing(true);
    } else {
      showToast({ type: 'error', title: 'Unable to Follow' });
    }
  };

  const unFollow = async () => {
    const res = await fetch(
      `/api/users/${session?.user?.id}/following/${profile.id}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok) {
      setIsFollowing(false);
    } else {
      showToast({ type: 'error', title: 'Unable to Unfollow' });
    }
  };

  return (
    <div className="absolute -bottom-20 right-2 md:right-0 flex flex-row items-center gap-2 md:gap-4">
      <Button
        onClick={isFollowing ? unFollow : follow}
        mode={isFollowing ? 'subtle' : 'primary'}
        shape="pill"
        onMouseOver={() => setHoveringFollowButton(true)}
        onMouseLeave={() => setHoveringFollowButton(false)}
      >
        {isFollowing
          ? hoveringFollowButton
            ? 'Unfollow'
            : 'Following'
          : 'Follow'}
      </Button>
      <Button Icon={Mail} onClick={() => {}} mode="secondary" size="medium" />
    </div>
  );
}
