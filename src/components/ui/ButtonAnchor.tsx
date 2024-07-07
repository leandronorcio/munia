import React from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/variants/buttonVariants';
import { VariantProps } from 'class-variance-authority';

type ButtonAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof buttonVariants>;

export function ButtonAnchor({ href, children, size, mode, shape, expand }: ButtonAnchorProps) {
  return (
    <a
      href={href}
      className={cn(
        buttonVariants({ size, mode, shape, expand }),
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
      )}>
      {children}
    </a>
  );
}
