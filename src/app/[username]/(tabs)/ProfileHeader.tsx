'use client';

import { ProfileActionButtons } from '../../../components/ProfileActionButtons';
import ProfilePhoto from './ProfilePhoto';
import CoverPhoto from './CoverPhoto';
import Tabs from './Tabs';
import { GetUser } from 'types';
import { useUserQuery } from '@/hooks/queries/useUserQuery';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Ellipse } from '@/svg_components';

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
  const router = useRouter();

  return (
    <>
      <div className="relative mb-[88px] md:pt-6">
        <div
          className="h-60 overflow-hidden drop-shadow-xl md:rounded-3xl"
          style={{
            background:
              'linear-gradient(95.08deg, #AF45DB 2.49%, #EB7B96 97.19%)',
          }}
        >
          <CoverPhoto
            isOwnProfile={isOwnProfile}
            photoUrl={profile.coverPhoto}
          />
        </div>
        <ProfilePhoto
          isOwnProfile={isOwnProfile}
          photoUrl={profile.profilePhoto}
        />
        <div className="absolute -bottom-20 right-2 md:right-0">
          {isOwnProfile ? (
            <Button
              shape="pill"
              mode="subtle"
              onPress={() => router.push('/settings/edit-profile')}
            >
              Edit Profile
            </Button>
          ) : (
            <ProfileActionButtons targetUserId={profile.id} />
          )}
        </div>
      </div>

      <div className="px-4">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="-mt-1 mb-2 text-muted-foreground">@{profile.username}</p>
        <p className="text-foreground/80">{profile.bio}</p>
        <div className="flex flex-row items-center gap-3">
          <Link href={`/${profile.username}/followers`} className="link">
            <span className="font-semibold">{profile.followerCount}</span>{' '}
            <span className="font-medium text-muted-foreground">Followers</span>
          </Link>
          <Ellipse className="h-1 w-1 fill-foreground" />
          <Link href={`/${profile.username}/following`} className="link">
            <span className="font-semibold">{profile.followingCount}</span>{' '}
            <span className="font-medium text-muted-foreground">Following</span>
          </Link>
        </div>
        <Tabs isOwnProfile={isOwnProfile} />
      </div>
    </>
  );
}
