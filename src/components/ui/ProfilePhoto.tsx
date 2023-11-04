'use client';

import { useRouter } from 'next/navigation';
import { FallbackProfilePhoto } from './FallbackProfilePhoto';
import Image from 'next/image';

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
        <Image
          src={photoUrl}
          alt={`${name}'s profile photo.`}
          width={1000}
          height={1000}
          className="cursor-pointer rounded-full"
          onClick={handleClick}
        />
      ) : (
        <FallbackProfilePhoto name={name} className={fallbackAvatarClassName} />
      )}
    </>
  );
}
