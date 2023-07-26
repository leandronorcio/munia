'use client';
import { ProfilePhoto } from './ProfilePhoto';
import { useUserData } from '@/hooks/useUserData';

export function ProfilePhotoOwn() {
  const [user] = useUserData();

  return (
    <ProfilePhoto
      photoUrl={user?.profilePhoto}
      username={user?.username}
      userId={user?.id}
    />
  );
}
