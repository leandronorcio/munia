import { UserSummaryAfterSetUp } from '@/types/definitions';
import { cn } from '@/lib/cn';
import { useEffect, useRef } from 'react';
import { ProfilePhoto } from './ui/ProfilePhoto';

export function TextAreaMentionItem({
  id,
  username,
  name,
  profilePhoto,
  handleSelectUserToMention,
  focused,
}: UserSummaryAfterSetUp & {
  handleSelectUserToMention: (username: string) => void;
  focused?: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!focused) return;
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, [focused]);

  return (
    <li
      ref={ref}
      onClick={() => handleSelectUserToMention(username!)}
      className={cn(
        'flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-accent',
        focused && 'bg-accent',
      )}
    >
      <div className="h-8 w-8">
        <ProfilePhoto photoUrl={profilePhoto} username={username} name={name} />
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">@{username}</p>
      </div>
    </li>
  );
}
