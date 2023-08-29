'use client';
import { ProfilePhoto } from './ProfilePhoto';
import { useSessionUserData } from '@/hooks/useSessionUserData';

export function ProfilePhotoOwn() {
  const [user] = useSessionUserData();

  return (
    <ProfilePhoto photoUrl={user?.profilePhoto} username={user?.username} />
  );
}
