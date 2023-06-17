'use client';
import { useSession } from 'next-auth/react';

export default function ProfilePhoto() {
  const { data: session } = useSession();

  return (
    <div
      className="w-full h-full rounded-full bg-cover"
      style={{
        backgroundImage: `url("${
          session?.user?.profilePhoto
            ? session.user.profilePhoto
            : '/default-profile-photo.jpg'
        }")`,
      }}
    ></div>
  );
}
