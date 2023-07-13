'use client';
import { useSession } from 'next-auth/react';
import { ProfilePhoto } from './ProfilePhoto';

export function ProfilePhotoOwn() {
  const { data: session } = useSession();

  return (
    <ProfilePhoto
      photoUrl={session?.user?.profilePhoto}
      username={session?.user?.username}
    />
  );
}
