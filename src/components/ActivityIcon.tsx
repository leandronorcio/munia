import SvgArrowReply from '@/svg_components/ArrowReply';
import SvgAtSign from '@/svg_components/AtSign';
import SvgComment from '@/svg_components/Comment';
import SvgHeart from '@/svg_components/Heart';
import SvgProfile from '@/svg_components/Profile';
import { ActivityType } from '@prisma/client';

function CreateFollowNotificationIcon() {
  return (
    <div className="absolute -bottom-2 right-0 rounded-full bg-gradient-to-r from-pink-400 to-red-500 p-2">
      <SvgProfile width={18} height={18} stroke="white" />
    </div>
  );
}
function LikeNotificationIcon() {
  return (
    <div className="absolute -bottom-2 right-0 rounded-full bg-gradient-to-r from-violet-400 to-violet-500 p-2">
      <SvgHeart width={18} height={18} stroke="white" />
    </div>
  );
}
function MentionNotificationIcon() {
  return (
    <div className="absolute -bottom-2 right-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-2">
      <SvgAtSign width={18} height={18} stroke="white" />
    </div>
  );
}
function CreateCommentNotificationIcon() {
  return (
    <div className="absolute -bottom-2 right-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 p-2">
      <SvgComment width={18} height={18} stroke="white" />
    </div>
  );
}
function CreateReplyNotificationIcon() {
  return (
    <div className="absolute -bottom-2 right-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 p-2">
      <SvgArrowReply width={18} height={18} stroke="white" />
    </div>
  );
}

const ActivityIcons = {
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

export function ActivityIcon({ type }: { type: ActivityType }) {
  return <>{ActivityIcons[type]()}</>;
}
