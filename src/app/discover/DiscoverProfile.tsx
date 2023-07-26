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
        <div className="py-8 bg-gradient-to-r from-purple-300/50 to-blue-300/50 hover:from-red-300/25 hover:to-green-300/25 flex flex-col items-center gap-4 rounded-t-3xl">
          <div className="w-24 h-24">
            <ProfilePhoto
              photoUrl={user.profilePhoto || undefined}
              username={user.username}
              userId={user.id}
            />
          </div>
          <ProfileActionButtons targetUserId={user.id} />
        </div>
        <div className="flex flex-col items-center py-8 bg-gray-50 rounded-b-3xl">
          <h2
            className="font-semibold text-2xl mb-3 px-2 text-center cursor-pointer hover:underline"
            onClick={handleNameClick}
          >
            {user.name}
          </h2>
          <p className="text-gray-500 mb-4 text-center">
            {user.bio || 'No bio yet'}
          </p>
          <div className="flex gap-6">
            <p className="text-lg  font-semibold flex gap-1 justify-center">
              <span>{user.followerCount}</span>{' '}
              <span className="text-gray-500">Followers</span>
            </p>
            <p className="text-lg  font-semibold flex gap-1 justify-center">
              <span>{user.followingCount}</span>{' '}
              <span className="text-gray-500">Followers</span>
            </p>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);
