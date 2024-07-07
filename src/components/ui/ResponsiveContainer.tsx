import { cn } from '@/lib/cn';
import React from 'react';

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function ResponsiveContainer({ children, ...rest }: ResponsiveContainerProps) {
  return (
    <div {...rest} className={cn('w-full md:w-[600px]', rest.className)}>
      {children}
    </div>
  );
}
