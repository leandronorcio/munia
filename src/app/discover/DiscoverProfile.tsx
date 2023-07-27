import { ProfileActionButtons } from '@/components/ProfileActionButtons';
import { ProfilePhoto } from '../../components/ui/ProfilePhoto';
import { memo } from 'react';
import { GetUser } from 'types';
import { useGoToProfile } from '@/hooks/useGoToProfile';

export const DiscoverProfile = memo(
  function DiscoverProfile({ user }: { user: GetUser }) {
    const { goToProfile } = useGoToProfile();
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
        <div className="flex flex-col items-center rounded-b-3xl bg-gray-50 py-8">
          <h2
            className="mb-3 cursor-pointer px-2 text-center text-2xl font-semibold hover:underline"
            onClick={handleNameClick}
          >
            {user.name}
          </h2>
          <p className="mb-4 text-center text-gray-500">
            {user.bio || 'No bio yet'}
          </p>
          <div className="flex gap-6">
            <p className="flex  justify-center gap-1 text-lg font-semibold">
              <span>{user.followerCount}</span>{' '}
              <span className="text-gray-500">Followers</span>
            </p>
            <p className="flex  justify-center gap-1 text-lg font-semibold">
              <span>{user.followingCount}</span>{' '}
              <span className="text-gray-500">Followers</span>
            </p>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id,
);
