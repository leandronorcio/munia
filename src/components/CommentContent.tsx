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
        <Link href={`/${username}`} className="link">
          {name}
        </Link>
      </h3>
      <p className="text-gray-499 text-gray-500">@{username}</p>
      <div
        className={cn(
          'my-2 rounded-2xl rounded-ss-none px-4 py-3',
          !shouldHighlight
            ? 'bg-slate-100'
            : 'bg-violet-100 ring-2 ring-violet-400',
        )}
      >
        <p className="mb-2 text-gray-700">
          <HighlightedMentionsAndHashTags
            text={content}
            shouldAddLinks={true}
          />
        </p>
        <p className="ml-auto text-sm text-gray-500">
          {formatDistanceToNowStrict(new Date(createdAt))} ago
        </p>
      </div>
    </div>
  );
}
