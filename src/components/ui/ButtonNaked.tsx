'use client';

import { cn } from '@/lib/cn';
import { useRef } from 'react';
import {
  AriaButtonProps,
  mergeProps,
  useButton,
  useFocusRing,
} from 'react-aria';

interface ButtonProps extends AriaButtonProps {
  children: React.ReactNode;
  className?: string;
}
export function ButtonNaked({ className, children, ...rest }: ButtonProps) {
  const ref = useRef(null);
  const { buttonProps } = useButton({ ...rest }, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={cn(
        'rounded-sm focus:outline-none',
        className,
        isFocusVisible && 'ring ring-violet-500 ring-offset-2',
      )}
    >
      {children}
    </button>
  );
}
