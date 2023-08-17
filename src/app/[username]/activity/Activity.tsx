import { GetActivity } from 'types';
import { ActivityCard } from './ActivityCard';
import { SemiBold } from '@/components/ui/SemiBold';
import Link from 'next/link';

export function Activity({
  type,
  sourceId,
  sourceUser,
  targetId,
  targetUser,
  createdAt,
}: GetActivity) {
  const { name: targetName, username: targetUserUsername } = targetUser;
  const isTargetOwn = sourceUser.id === targetUser.id;
  const possessiveNoun = isTargetOwn ? 'your own' : `${targetName}'s`;
  const properNoun = isTargetOwn ? 'yourself' : targetName;

  if (type === 'CREATE_FOLLOW') {
    return (
      <Link href={`/${targetUserUsername}`}>
        <ActivityCard type={type} user={targetUser} date={new Date(createdAt)}>
          <SemiBold>You</SemiBold> have started following{' '}
          <SemiBold>{targetName}</SemiBold>!
        </ActivityCard>
      </Link>
    );
  }

  if (type === 'POST_LIKE') {
    return (
      <Link href={`/posts/${targetId}`}>
        <ActivityCard type={type} user={targetUser} date={new Date(createdAt)}>
          <SemiBold>You</SemiBold> liked <SemiBold>{possessiveNoun}</SemiBold>{' '}
          post.
        </ActivityCard>
      </Link>
    );
  }
  if (type === 'POST_MENTION') {
    return (
      <Link href={`/posts/${sourceId}`}>
        <ActivityCard type={type} user={targetUser} date={new Date(createdAt)}>
          <SemiBold>You</SemiBold> mentioned <SemiBold>{properNoun}</SemiBold>{' '}
          in your post.
        </ActivityCard>
      </Link>
    );
  }

  if (type === 'CREATE_COMMENT') {
    return (
      <Link href={`/comments/${sourceId}`}>
        <ActivityCard type={type} user={targetUser} date={new Date(createdAt)}>
          <SemiBold>You</SemiBold> commented on{' '}
          <SemiBold>{possessiveNoun}</SemiBold> post.
        </ActivityCard>
      </Link>
    );
  }
  if (type === 'COMMENT_LIKE') {
    return (
      <Link href={`/comments/${targetId}`}>
        <ActivityCard type={type} user={targetUser} date={new Date(createdAt)}>
          <SemiBold>You</SemiBold> liked <SemiBold>{possessiveNoun}</SemiBold>{' '}
          comment.
        </ActivityCard>
      </Link>
    );
  }
  if (type === 'COMMENT_MENTION') {
    return (
      <Link href={`/comments/${sourceId}`}>
        <ActivityCard type={type} user={targetUser} date={new Date(createdAt)}>
          <SemiBold>You</SemiBold> mentioned <SemiBold>{properNoun}</SemiBold>{' '}
          in your comment.
        </ActivityCard>
      </Link>
    );
  }

  if (type === 'CREATE_REPLY') {
    return (
      <Link href={`/comments/${sourceId}`}>
        <ActivityCard type={type} user={targetUser} date={new Date(createdAt)}>
          <SemiBold>You</SemiBold> replied to{' '}
          <SemiBold>{possessiveNoun}</SemiBold> comment.
        </ActivityCard>
      </Link>
    );
  }
  if (type === 'REPLY_LIKE') {
    return (
      <Link href={`/comments/${targetId}`}>
        <ActivityCard type={type} user={targetUser} date={new Date(createdAt)}>
          <SemiBold>You</SemiBold> liked <SemiBold>{possessiveNoun}</SemiBold>{' '}
          reply.
        </ActivityCard>
      </Link>
    );
  }
  if (type === 'REPLY_MENTION') {
    return (
      <Link href={`/comments/${sourceId}`}>
        <ActivityCard type={type} user={targetUser} date={new Date(createdAt)}>
          <SemiBold>You</SemiBold> mentioned <SemiBold>{properNoun}</SemiBold>{' '}
          in your reply.
        </ActivityCard>
      </Link>
    );
  }

  return <></>;
}
