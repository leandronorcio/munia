import React from 'react';
// https://stackoverflow.com/a/51835761/8434369
interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DropdownItem({ children, ...rest }: DropdownItemProps) {
  return (
    <div
      className="px-6 py-2 text-gray-600 hover:bg-slate-200 active:text-black"
      {...rest}
    >
      {children}
    </div>
  );
}
