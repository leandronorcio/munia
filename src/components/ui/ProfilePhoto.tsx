'use client';

import { useRouter } from 'next/navigation';

export function ProfilePhoto({
  photoUrl,
  username,
}: {
  photoUrl?: string | null;
  username?: string | null;
}) {
  const router = useRouter();
  const handleClick = () => {
    if (!username) return;
    router.push(`/${username}`);
  };

  return (
    <img
      src={photoUrl || '/default-profile-photo.jpg'}
      className="h-full w-full cursor-pointer rounded-full object-cover"
      onClick={handleClick}
    />
  );
}
