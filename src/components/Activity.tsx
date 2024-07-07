import { GetActivity } from '@/types/definitions';
import { SemiBold } from '@/components/ui/SemiBold';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useNotificationsReadStatusMutations } from '@/hooks/mutations/useNotificationsReadStatusMutations';
import { ActivityCard } from './ActivityCard';

/** Use this component to render individual activities or notifications. */
export function Activity({
  id,
  type,
  sourceId,
  sourceUser,
  targetId,
  targetUser,
  createdAt,
  isNotificationRead,
  content,
}: GetActivity) {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();
  const { markAsReadMutation } = useNotificationsReadStatusMutations();

  // If this is an activity, the `sourceUser.id` is guaranteed to equal the `userId`.
  const isActivity = sourceUser.id === userId;
  const isNotification = targetUser.id === userId;
  const userToDisplay = isActivity ? targetUser : sourceUser;

  const sourceProperNoun = isActivity ? 'You' : sourceUser.name;
  const sourcePossessiveNoun = isActivity
    ? 'your'
    : sourceUser.gender === 'MALE'
    ? 'his'
    : sourceUser.gender === 'FEMALE'
    ? 'her'
    : 'their';

  const targetProperNoun = isNotification ? 'you' : targetUser.name;
  const targetPossessiveNoun = isNotification ? 'your' : `${targetUser.name}'s`;

  const isRead = isActivity || isNotificationRead;
  const navigate = (href: string) => () => {
    router.push(href);

    // Set the notification as read
    if (!isNotification) return;
    markAsReadMutation.mutate({ notificationId: id });
  };

  if (type === 'CREATE_FOLLOW') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/${isActivity ? targetUser.username : sourceUser.username}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> started following <SemiBold>{targetProperNoun}</SemiBold>!
      </ActivityCard>
    );
  }

  if (type === 'POST_LIKE') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/posts/${targetId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> liked <SemiBold>{targetPossessiveNoun}</SemiBold> post: &quot;{content}
        &quot;
      </ActivityCard>
    );
  }
  if (type === 'POST_MENTION') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/posts/${sourceId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> mentioned <SemiBold>{targetProperNoun}</SemiBold> in{' '}
        {sourcePossessiveNoun} post: &quot;{content}&quot;
      </ActivityCard>
    );
  }

  if (type === 'CREATE_COMMENT') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${sourceId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> commented on <SemiBold>{targetPossessiveNoun}</SemiBold> post: &quot;
        {content}&quot;
      </ActivityCard>
    );
  }
  if (type === 'COMMENT_LIKE') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${targetId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> liked <SemiBold>{targetPossessiveNoun}</SemiBold> comment: &quot;
        {content}
        &quot;
      </ActivityCard>
    );
  }
  if (type === 'COMMENT_MENTION') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${sourceId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> mentioned <SemiBold>{targetProperNoun}</SemiBold> in{' '}
        {sourcePossessiveNoun} comment: &quot;{content}&quot;
      </ActivityCard>
    );
  }

  if (type === 'CREATE_REPLY') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${sourceId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> replied to <SemiBold>{targetPossessiveNoun}</SemiBold> comment: &quot;
        {content}
        &quot;
      </ActivityCard>
    );
  }
  if (type === 'REPLY_LIKE') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${targetId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> liked <SemiBold>{targetPossessiveNoun}</SemiBold> reply: &quot;{content}
        &quot;
      </ActivityCard>
    );
  }
  if (type === 'REPLY_MENTION') {
    return (
      <ActivityCard
        type={type}
        user={userToDisplay}
        date={new Date(createdAt)}
        isRead={isRead}
        onClick={navigate(`/comments/${sourceId}`)}>
        <SemiBold>{sourceProperNoun}</SemiBold> mentioned <SemiBold>{targetProperNoun}</SemiBold> in{' '}
        {sourcePossessiveNoun} reply: &quot;{content}&quot;
      </ActivityCard>
    );
  }

  return null;
}
