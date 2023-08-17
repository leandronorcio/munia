import { ProfilePhoto } from '@/components/ui/ProfilePhoto';
import SvgArrowReply from '@/svg_components/ArrowReply';
import SvgAtSign from '@/svg_components/AtSign';
import SvgComment from '@/svg_components/Comment';
import SvgHeart from '@/svg_components/Heart';
import SvgProfile from '@/svg_components/Profile';
import { ActivityType } from '@prisma/client';
import { formatDistanceToNowStrict } from 'date-fns';
import { ComponentProps } from 'react';
import { UserSummary } from 'types';

interface ActivityCardProps extends ComponentProps<'div'> {
  children: React.ReactNode;
  user: UserSummary;
  date: Date;
  type: ActivityType;
}

const CreateFollowNotificationIcon = () => (
  <div className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-pink-400 to-red-500 p-2">
    <SvgProfile width={18} height={18} stroke="white" />
  </div>
);
const LikeNotificationIcon = () => (
  <div className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-violet-400 to-violet-500 p-2">
    <SvgHeart width={18} height={18} stroke="white" />
  </div>
);
const MentionNotificationIcon = () => (
  <div className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-2">
    <SvgAtSign width={18} height={18} stroke="white" />
  </div>
);
const CreateCommentNotificationIcon = () => (
  <div className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 p-2">
    <SvgComment width={18} height={18} stroke="white" />
  </div>
);
const CreateReplyNotificationIcon = () => (
  <div className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 p-2">
    <SvgArrowReply width={18} height={18} stroke="white" />
  </div>
);

const ActivityIcon = {
  CREATE_FOLLOW: () => <CreateFollowNotificationIcon />,

  POST_LIKE: () => <LikeNotificationIcon />,
  POST_MENTION: () => <MentionNotificationIcon />,

  CREATE_COMMENT: () => <CreateCommentNotificationIcon />,
  COMMENT_LIKE: () => <LikeNotificationIcon />,
  COMMENT_MENTION: () => <MentionNotificationIcon />,

  CREATE_REPLY: () => <CreateReplyNotificationIcon />,
  REPLY_LIKE: () => <LikeNotificationIcon />,
  REPLY_MENTION: () => <MentionNotificationIcon />,
};

export function ActivityCard({
  children,
  user,
  date,
  type,
}: ActivityCardProps) {
  return (
    <div className="mb-4 flex cursor-pointer gap-3 rounded-3xl bg-gray-100 p-4 hover:bg-gray-200/70">
      <div className="relative flex-initial">
        <div className="h-16 w-16 sm:h-20 sm:w-20">
          <ProfilePhoto
            photoUrl={user.profilePhoto}
            username={user.username}
            userId={user.username}
          />
        </div>
        {ActivityIcon[type]()}
      </div>
      <div className="my-auto">
        <p>{children}</p>
        <p className="text-sm text-gray-600">
          {formatDistanceToNowStrict(date)} ago
        </p>
      </div>
    </div>
  );
}
