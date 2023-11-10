'use client';

import { useRouter } from 'next/navigation';
import { FallbackProfilePhoto } from './FallbackProfilePhoto';

export function ProfilePhoto({
  name,
  photoUrl,
  username,
  fallbackAvatarClassName,
}: {
  name: string;
  username: string;
  photoUrl?: string | null;
  fallbackAvatarClassName?: string;
}) {
  const router = useRouter();
  const handleClick = () => {
    if (!username) return;
    router.push(`/${username}`);
  };

  return (
    <>
      {photoUrl ? (
        <img
          src={photoUrl || '/default-profile-photo.jpg'}
          alt={`${name}&apos; profile photo.`}
          className="h-full w-full cursor-pointer rounded-full object-cover"
          onClick={handleClick}
        />
      ) : (
        <FallbackProfilePhoto name={name} className={fallbackAvatarClassName} />
      )}
    </>
  );
}
