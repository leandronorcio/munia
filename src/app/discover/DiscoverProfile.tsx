import { ProfileActionButtons } from '@/components/ProfileActionButtons';
import { ProfilePhoto } from '../../components/ui/ProfilePhoto';
import { memo } from 'react';
import { useGoToProfile } from '@/hooks/useGoToProfile';
import { useUserQuery } from '@/hooks/queries/useUserQuery';

export const DiscoverProfile = memo(
  function DiscoverProfile({ userId }: { userId: string }) {
    /**
     * Since the query function of <DiscoverProfiles> already created a query
     * cache for the user data, we can just access it here using the `useUserQuery()`
     */
    const { data: user, isLoading, isError } = useUserQuery(userId);
    const { goToProfile } = useGoToProfile();

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading profile.</div>;
    if (!user) return <></>;

    const handleNameClick = () =>
      goToProfile({ userId: user.id, username: user.username! });

    return (
      <div className="gap-4 drop-shadow-sm">
        <div className="flex flex-col items-center gap-4 rounded-t-3xl bg-gradient-to-r from-purple-300/50 to-blue-300/50 py-8 hover:from-red-300/25 hover:to-green-300/25">
          <div className="h-24 w-24">
            <ProfilePhoto
              photoUrl={user.profilePhoto || undefined}
              username={user.username}
              userId={user.id}
            />
          </div>
          <ProfileActionButtons targetUserId={user.id} />
        </div>
        <div className="flex flex-col items-center rounded-b-3xl bg-white py-8">
          <h2
            className="mb-3 cursor-pointer px-2 text-center text-2xl font-semibold hover:underline"
            onClick={handleNameClick}
          >
            {user.name}
          </h2>
          <p className="mb-4 px-2 text-center text-gray-500">
            {user.bio || 'No bio yet'}
          </p>
          <div className="flex gap-6">
            <p className="flex justify-center gap-1 text-lg font-semibold">
              <span>{user.followerCount}</span>{' '}
              <span className="text-gray-500">Followers</span>
            </p>
            <p className="flex justify-center gap-1 text-lg font-semibold">
              <span>{user.followingCount}</span>{' '}
              <span className="text-gray-500">Following</span>
            </p>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.userId === nextProps.userId,
);
