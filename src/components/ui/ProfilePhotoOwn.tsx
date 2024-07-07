'use client';

import { useSessionUserData } from '@/hooks/useSessionUserData';
import { ProfilePhoto } from './ProfilePhoto';

export function ProfilePhotoOwn() {
  const [user] = useSessionUserData();

  if (!user) {
    return null;
  }
  return <ProfilePhoto name={user.name} username={user.username} photoUrl={user?.profilePhoto} />;
}
