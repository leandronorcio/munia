'use client';
import { useSession } from 'next-auth/react';

export default function ProfilePhoto({ photoUrl }: { photoUrl?: string }) {
  const { data: session } = useSession();

  return (
    <img
      src={
        photoUrl
          ? photoUrl
          : session?.user?.profilePhoto
          ? session.user.profilePhoto
          : '/default-profile-photo.jpg'
      }
      className="w-full h-full object-cover rounded-full"
    />
  );
}
