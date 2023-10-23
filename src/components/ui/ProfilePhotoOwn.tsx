'use client';
import { ProfilePhoto } from './ProfilePhoto';
import { useSessionUserData } from '@/hooks/useSessionUserData';

export function ProfilePhotoOwn() {
  const [user] = useSessionUserData();

  return (
    <>
      {user && user.name !== null && (
        <ProfilePhoto
          name={user.name}
          username={user.username}
          photoUrl={user?.profilePhoto}
        />
      )}
    </>
  );
}
