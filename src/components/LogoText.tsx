import { cn } from '@/lib/cn';
import React from 'react';

interface LogoTextProps extends React.HTMLAttributes<HTMLHeadElement> {}
export function LogoText({ ...rest }: LogoTextProps) {
  return (
    <h1 {...rest} className={cn('font-bold text-primary', rest.className)}>
      Munia
    </h1>
  );
}
