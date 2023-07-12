'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePhoto({
  photoUrl,
  username,
}: {
  photoUrl?: string;
  username?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <img
      src={
        photoUrl
          ? photoUrl
          : session?.user?.profilePhoto
          ? session.user.profilePhoto
          : '/default-profile-photo.jpg'
      }
      className="w-full h-full object-cover rounded-full cursor-pointer"
      onClick={() =>
        username
          ? router.push(`/${username}`)
          : router.push(`/${session?.user?.username}`)
      }
    />
  );
}
