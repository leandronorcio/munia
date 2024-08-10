import { ProfileActionButtons } from '@/components/ProfileActionButtons';
import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import { memo } from 'react';
import { useUserQuery } from '@/hooks/queries/useUserQuery';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/cn';
import Link from 'next/link';

export const DiscoverProfile = memo(
  ({ userId }: { userId: string }) => {
    /**
     * Since the query function of <DiscoverProfiles> already created a query
     * cache for the user data, we can just access it here using the `useUserQuery()`
     */
    const { data: user, isPending, isError } = useUserQuery(userId);
    const { data: session } = useSession();

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Error loading profile.</div>;
    if (!user) return null;

    return (
      <div className="gap-4 drop-shadow-sm">
        <div
          className={cn(
            'flex flex-col items-center gap-4 rounded-t-3xl bg-gradient-to-r py-8',
            user.gender === 'MALE' && 'from-blue-200/50 to-blue-300/50 dark:from-blue-600/50 dark:to-blue-800/50',
            user.gender === 'FEMALE' && 'from-pink-200/50 to-pink-300/50 dark:from-pink-600/50 dark:to-pink-800/50',
            user.gender === 'NONBINARY' &&
              'dark:from-yellow-699/50 from-yellow-200/50 via-purple-200/50 to-black dark:via-purple-800/50 dark:to-black',
            !user.gender && 'bg-muted/70',
          )}>
          <div className="h-24 w-24">
            <ProfilePhoto
              name={user.name}
              username={user.username}
              photoUrl={user.profilePhoto}
              fallbackAvatarClassName="text-5xl"
            />
          </div>
          {/* Only show the action buttons when the profile is not the user's. */}
          {session?.user.id !== user.id && <ProfileActionButtons targetUserId={user.id} />}
        </div>
        <div className="flex flex-col items-center rounded-b-3xl bg-card py-8">
          <h2 className="mb-3 cursor-pointer px-2 text-center text-2xl font-semibold text-foreground">
            <Link href={`/${user.username}`} className="link">
              {user.name}
            </Link>
          </h2>
          <p className="mb-4 px-2 text-center text-muted-foreground">{user.bio || 'No bio yet'}</p>
          <div className="flex gap-6">
            <p className="flex justify-center gap-1 text-lg font-semibold">
              <span>{user.followerCount}</span> <span className="text-muted-foreground">Followers</span>
            </p>
            <p className="flex justify-center gap-1 text-lg font-semibold">
              <span>{user.followingCount}</span> <span className="text-muted-foreground">Following</span>
            </p>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.userId === nextProps.userId,
);

DiscoverProfile.displayName = 'DiscoverProfile';
