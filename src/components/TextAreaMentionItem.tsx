import { UserSummary } from 'types';
import { ProfilePhoto } from './ui/ProfilePhoto';
import { cn } from '@/lib/cn';
import { useEffect, useRef } from 'react';

export function TextAreaMentionItem({
  id,
  username,
  name,
  profilePhoto,
  handleSelectUserToMention,
  focused,
}: UserSummary & {
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
        'flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-slate-200/70',
        focused && 'bg-slate-200/70',
      )}
    >
      <div className="h-8 w-8">
        <ProfilePhoto photoUrl={profilePhoto} />
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-600">@{username}</p>
      </div>
    </li>
  );
}
