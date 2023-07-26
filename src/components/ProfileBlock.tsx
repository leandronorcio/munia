import { useGoToProfile } from '@/hooks/useGoToProfile';
import { ProfilePhoto } from './ui/ProfilePhoto';

export default function ProfileBlock({
  type = 'post',
  userId,
  username,
  name,
  time,
  photoUrl,
}: {
  type?: 'post' | 'comment';
  userId: string;
  name: string;
  username: string;
  time: string;
  photoUrl: string;
}) {
  const { goToProfile } = useGoToProfile();
  const handleClick = () => goToProfile({ userId, username });

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar">
      <div className="w-12 h-12 flex-shrink-0">
        <ProfilePhoto photoUrl={photoUrl} username={username} />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 sm:gap-3">
          <h2
            className="font-semibold text-lg text-gray-700 cursor-pointer hover:underline"
            onClick={handleClick}
          >
            {name}
          </h2>
          {type === 'comment' && (
            <h2 className="text-sm text-gray-500">{time} ago</h2>
          )}
        </div>
        {type === 'post' && (
          <h2 className="text-sm text-gray-500">{time} ago</h2>
        )}
      </div>
    </div>
  );
}
