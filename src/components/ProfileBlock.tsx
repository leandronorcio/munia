import { ProfilePhoto } from './ui/ProfilePhoto';
import Link from 'next/link';

export default function ProfileBlock({
  type = 'post',
  username,
  name,
  time,
  photoUrl,
}: {
  type?: 'post' | 'comment';
  name: string;
  username: string;
  time: string;
  photoUrl: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="h-12 w-12 flex-shrink-0">
        <ProfilePhoto photoUrl={photoUrl} username={username} />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 sm:gap-3">
          <h2 className="cursor-pointer text-lg font-semibold text-gray-700">
            <Link href={`/${username}`} className="link">
              {name}
            </Link>
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
