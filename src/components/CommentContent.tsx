import { formatDistanceToNowStrict } from 'date-fns';
import { HighlightedMentionsAndHashTags } from './HighlightedMentionsAndHashTags';
import { cn } from '@/lib/cn';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

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
  }, [ref.current]);

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
          !shouldHighlight
            ? 'border border-input'
            : 'bg-primary-accent/70 text-primary-foreground ring-2 ring-primary-foreground',
        )}
      >
        <p className="mb-1 text-foreground">
          <HighlightedMentionsAndHashTags
            text={content}
            shouldAddLinks={true}
          />
        </p>
        <p className="ml-auto text-sm text-muted-foreground">
          {formatDistanceToNowStrict(new Date(createdAt))} ago
        </p>
      </div>
    </div>
  );
}
