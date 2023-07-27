import { cn } from '@/lib/cn';
import React from 'react';
// https://stackoverflow.com/a/51835761/8434369
interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active?: boolean;
}

export function DropdownItem({ children, active, ...rest }: DropdownItemProps) {
  return (
    <div
      className={cn(
        'px-6 py-2 text-gray-600 hover:bg-slate-200 active:text-black',
        active && 'bg-slate-200 text-black',
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
