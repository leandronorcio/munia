import { useSession } from 'next-auth/react';
import ProfilePhoto from './ui/ProfilePhoto';
import { cn } from '@/lib/cn';

export default function ProfileBlock({
  type = 'post',
}: {
  type?: 'post' | 'comment';
}) {
  const { data: session } = useSession();
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar">
      <div className="w-12 h-12 flex-shrink-0">
        <ProfilePhoto />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 sm:gap-3">
          <h2 className="font-semibold text-lg text-gray-700">
            {session?.user?.name}
          </h2>
          <h2
            className={cn(
              'text-lg text-gray-500 xl:block',
              type === 'comment' && 'hidden'
            )}
          >
            @{session?.user?.id}
          </h2>
          {type === 'comment' && (
            <h2 className="text-sm text-gray-500">30m ago</h2>
          )}
        </div>
        {type === 'post' && <h2 className="text-sm text-gray-500">30m ago</h2>}
      </div>
    </div>
  );
}
