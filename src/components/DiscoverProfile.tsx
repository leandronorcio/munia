import { User } from '@prisma/client';
import Button from './ui/Button';
import ProfilePhoto from './ui/ProfilePhoto';
import { memo } from 'react';

export const DiscoverProfile = memo(
  function DiscoverProfile({ user }: { user: User }) {
    return (
      <div className="gap-4 drop-shadow-sm">
        <div className="py-8 bg-gradient-to-r from-purple-300/50 to-blue-300/50 hover:from-red-300/25 hover:to-green-300/25 flex flex-col items-center gap-4 rounded-t-3xl">
          <div className="w-24 h-24">
            <ProfilePhoto photoUrl={user.profilePhoto || undefined} />
          </div>
          <Button mode="secondary" shape="pill" size="small" expand="half">
            Follow
          </Button>
        </div>
        <div className="flex flex-col items-center py-8 bg-gray-50 rounded-b-3xl">
          <h2 className="font-semibold text-2xl mb-3 px-2 text-center">
            {user.name}
          </h2>
          <p className="text-gray-500 mb-4">{user.bio || 'No bio yet'}</p>
          <div className="flex gap-6">
            <p className="text-lg  font-semibold flex gap-1 justify-center">
              <span>0</span> <span className="text-gray-500">Followers</span>
            </p>
            <p className="text-lg  font-semibold flex gap-1 justify-center">
              <span>0</span> <span className="text-gray-500">Followers</span>
            </p>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);
