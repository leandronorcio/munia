import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import { ActivityType } from '@prisma/client';
import { formatDistanceToNowStrict } from 'date-fns';
import { ComponentProps, useRef } from 'react';
import { UserSummary } from 'types';
import { ActivityIcon } from './ActivityIcon';
import { mergeProps, useFocusRing, useLink } from 'react-aria';
import { cn } from '@/lib/cn';

interface ActivityCardProps extends ComponentProps<'div'> {
  children: React.ReactNode;
  user: UserSummary;
  date: Date;
  type: ActivityType;
  isRead: boolean;
}

export function ActivityCard({
  children,
  user,
  date,
  type,
  isRead,
  ...rest
}: ActivityCardProps) {
  const ref = useRef(null);
  let { linkProps } = useLink({ elementType: 'div' }, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <div
      {...mergeProps(linkProps, focusProps)}
      ref={ref}
      className={cn(
        'mb-4 flex cursor-pointer gap-3 rounded-3xl bg-gray-100 p-4 last:mb-0 hover:bg-gray-200/70 focus:outline-none',
        isFocusVisible && 'ring ring-violet-500 ring-offset-2',
      )}
      aria-label="Open link"
      {...rest}
    >
      <div className="relative flex-initial">
        <div className="h-16 w-16 sm:h-20 sm:w-20">
          <ProfilePhoto photoUrl={user.profilePhoto} username={user.username} />
        </div>
        <ActivityIcon type={type} />
      </div>

      <div className="my-auto flex-1">
        <p>{children}</p>
        <p className="text-sm text-gray-600">
          {formatDistanceToNowStrict(date)} ago
        </p>
      </div>

      {!isRead && (
        <div className="grid place-items-center">
          <div className="h-3 w-3 rounded-full bg-violet-500"></div>
        </div>
      )}
    </div>
  );
}
