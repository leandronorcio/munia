import { cn } from '@/lib/cn';
import { getAvatarFallback } from '@/lib/getAvatarFallback';
import React from 'react';

export function FallbackProfilePhoto({
  name,
  // eslint-disable-next-line react/prop-types
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { name: string }) {
  return (
    <div
      {...rest}
      className={cn(
        'flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-muted text-xl text-muted-foreground',
        className,
      )}>
      {getAvatarFallback(name)}
    </div>
  );
}
