'use client';

import { useGoToProfile } from '@/hooks/useGoToProfile';

export function ProfilePhoto({
  photoUrl,
  username,
  userId,
}: {
  photoUrl?: string | null;
  username?: string | null;
  userId?: string | null;
}) {
  const { goToProfile } = useGoToProfile();

  const handleClick = () => {
    if (!userId || !username) return;
    goToProfile({
      userId,
      username,
    });
  };

  return (
    <img
      src={photoUrl || '/default-profile-photo.jpg'}
      className="h-full w-full cursor-pointer rounded-full object-cover"
      onClick={handleClick}
    />
  );
}
