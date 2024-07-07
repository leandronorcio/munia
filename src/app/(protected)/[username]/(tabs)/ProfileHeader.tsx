'use client';

import { ProfileActionButtons } from '@/components/ProfileActionButtons';
import { GetUser } from '@/types/definitions';
import { useUserQuery } from '@/hooks/queries/useUserQuery';
import Link from 'next/link';
import { Ellipse } from '@/svg_components';
import { ButtonLink } from '@/components/ui/ButtonLink';
import Tabs from './Tabs';
import CoverPhoto from './CoverPhoto';
import ProfilePhoto from './ProfilePhoto';

export function ProfileHeader({
  isOwnProfile,
  initialProfileData,
}: {
  isOwnProfile: boolean;
  initialProfileData: GetUser;
}) {
  const { data } = useUserQuery(initialProfileData.id);
  // If there is no query of the user data yet, use the
  // `initialProfileData` that was fetched on server.
  const profile = data || initialProfileData;

  return (
    <>
      <div className="relative mb-[88px] md:pt-6">
        <div className="h-60 overflow-hidden bg-muted/30 drop-shadow-xl md:rounded-3xl">
          <CoverPhoto isOwnProfile={isOwnProfile} photoUrl={profile.coverPhoto} />
        </div>
        <ProfilePhoto isOwnProfile={isOwnProfile} photoUrl={profile.profilePhoto} name={initialProfileData.name!} />
        <div className="absolute -bottom-20 right-2 md:right-0">
          {isOwnProfile ? (
            <ButtonLink shape="pill" mode="subtle" href="/edit-profile">
              Edit Profile
            </ButtonLink>
          ) : (
            <ProfileActionButtons targetUserId={profile.id} />
          )}
        </div>
      </div>

      <div className="px-4 pt-2">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="-mt-1 mb-2 text-muted-foreground">@{profile.username}</p>
        <p className="text-foreground/80">{profile.bio}</p>
        <div className="flex flex-row items-center gap-3">
          <Link
            href={`/${profile.username}/followers`}
            className="link"
            title={`${initialProfileData.name}&apos; followers`}>
            <span className="font-semibold">{profile.followerCount}</span>{' '}
            <span className="font-medium text-muted-foreground">Followers</span>
          </Link>
          <Ellipse className="h-1 w-1 fill-foreground" />
          <Link
            href={`/${profile.username}/following`}
            className="link"
            title={`${initialProfileData.name}&apos; followed users`}>
            <span className="font-semibold">{profile.followingCount}</span>{' '}
            <span className="font-medium text-muted-foreground">Following</span>
          </Link>
        </div>
        <Tabs isOwnProfile={isOwnProfile} />
      </div>
    </>
  );
}
