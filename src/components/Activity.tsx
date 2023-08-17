import { GetActivity } from 'types';
import { ActivityCard } from './ActivityCard';
import { SemiBold } from '@/components/ui/SemiBold';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

/** Use this component to render individual activities or notifications. */
export function Activity({
  type,
  sourceId,
  sourceUser,
  targetId,
  targetUser,
  createdAt,
}: GetActivity) {
  const { data: session } = useSession();
  const userId = session?.user.id;

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

  if (type === 'CREATE_FOLLOW') {
    return (
      <Link href={`/${isActivity ? targetUser.username : sourceUser.username}`}>
        <ActivityCard
          type={type}
          user={userToDisplay}
          date={new Date(createdAt)}
        >
          <SemiBold>{sourceProperNoun}</SemiBold> started following{' '}
          <SemiBold>{targetProperNoun}</SemiBold>!
        </ActivityCard>
      </Link>
    );
  }

  if (type === 'POST_LIKE') {
    return (
      <Link href={`/posts/${targetId}`}>
        <ActivityCard
          type={type}
          user={userToDisplay}
          date={new Date(createdAt)}
        >
          <SemiBold>{sourceProperNoun}</SemiBold> liked{' '}
          <SemiBold>{targetPossessiveNoun}</SemiBold> post.
        </ActivityCard>
      </Link>
    );
  }
  if (type === 'POST_MENTION') {
    return (
      <Link href={`/posts/${sourceId}`}>
        <ActivityCard
          type={type}
          user={userToDisplay}
          date={new Date(createdAt)}
        >
          <SemiBold>{sourceProperNoun}</SemiBold> mentioned{' '}
          <SemiBold>{targetProperNoun}</SemiBold> in {sourcePossessiveNoun}{' '}
          post.
        </ActivityCard>
      </Link>
    );
  }

  if (type === 'CREATE_COMMENT') {
    return (
      <Link href={`/comments/${sourceId}`}>
        <ActivityCard
          type={type}
          user={userToDisplay}
          date={new Date(createdAt)}
        >
          <SemiBold>{sourceProperNoun}</SemiBold> commented on{' '}
          <SemiBold>{targetPossessiveNoun}</SemiBold> post.
        </ActivityCard>
      </Link>
    );
  }
  if (type === 'COMMENT_LIKE') {
    return (
      <Link href={`/comments/${targetId}`}>
        <ActivityCard
          type={type}
          user={userToDisplay}
          date={new Date(createdAt)}
        >
          <SemiBold>{sourceProperNoun}</SemiBold> liked{' '}
          <SemiBold>{targetPossessiveNoun}</SemiBold> comment.
        </ActivityCard>
      </Link>
    );
  }
  if (type === 'COMMENT_MENTION') {
    return (
      <Link href={`/comments/${sourceId}`}>
        <ActivityCard
          type={type}
          user={userToDisplay}
          date={new Date(createdAt)}
        >
          <SemiBold>{sourceProperNoun}</SemiBold> mentioned{' '}
          <SemiBold>{targetProperNoun}</SemiBold> in {sourcePossessiveNoun}{' '}
          comment.
        </ActivityCard>
      </Link>
    );
  }

  if (type === 'CREATE_REPLY') {
    return (
      <Link href={`/comments/${sourceId}`}>
        <ActivityCard
          type={type}
          user={userToDisplay}
          date={new Date(createdAt)}
        >
          <SemiBold>{sourceProperNoun}</SemiBold> replied to{' '}
          <SemiBold>{targetPossessiveNoun}</SemiBold> comment.
        </ActivityCard>
      </Link>
    );
  }
  if (type === 'REPLY_LIKE') {
    return (
      <Link href={`/comments/${targetId}`}>
        <ActivityCard
          type={type}
          user={userToDisplay}
          date={new Date(createdAt)}
        >
          <SemiBold>{sourceProperNoun}</SemiBold> liked{' '}
          <SemiBold>{targetPossessiveNoun}</SemiBold> reply.
        </ActivityCard>
      </Link>
    );
  }
  if (type === 'REPLY_MENTION') {
    return (
      <Link href={`/comments/${sourceId}`}>
        <ActivityCard
          type={type}
          user={userToDisplay}
          date={new Date(createdAt)}
        >
          <SemiBold>{sourceProperNoun}</SemiBold> mentioned{' '}
          <SemiBold>{targetProperNoun}</SemiBold> in {sourcePossessiveNoun}{' '}
          reply.
        </ActivityCard>
      </Link>
    );
  }

  return <></>;
}
