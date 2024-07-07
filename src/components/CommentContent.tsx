import { formatDistanceToNowStrict } from 'date-fns';
import { cn } from '@/lib/cn';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { HighlightedMentionsAndHashTags } from './HighlightedMentionsAndHashTags';

export function CommentContent({
  name,
  username,
  content,
  createdAt,
  shouldHighlight,
}: {
  name: string | null;
  username: string | null;
  content: string;
  createdAt: string | Date;
  shouldHighlight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!shouldHighlight) return;
    if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth' });
  }, [shouldHighlight]);

  return (
    <div ref={ref}>
      <h3 className="text-md font-semibold">
        <Link href={`/${username}`} className="link text-foreground">
          {name}
        </Link>
      </h3>
      <p className="text-muted-foreground">@{username}</p>
      <div
        className={cn(
          'my-2 rounded-[32px] rounded-ss-none px-6 py-3',
          !shouldHighlight ? 'border border-input' : 'ring-2 ring-primary',
        )}>
        <p className="mb-1 text-foreground">
          <HighlightedMentionsAndHashTags text={content} shouldAddLinks />
        </p>
        <p className="ml-auto text-sm text-muted-foreground">{formatDistanceToNowStrict(new Date(createdAt))} ago</p>
      </div>
    </div>
  );
}
