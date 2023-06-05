'use client';
import { cn } from '@/lib/cn';
import { usePathname, useRouter } from 'next/navigation';
import path from 'path';
import { SVGProps } from 'react';

export default function SidebarMenuItem({
  children,
  className,
  Icon,
  route,
}: {
  children: React.ReactNode;
  className?: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  route: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive =
    route.length === 1 ? pathname === route : pathname.search(route) !== -1;
  return (
    <div
      className={cn([
        'flex flex-row gap-4 items-center h-14 p-6 mt-2 w-52 rounded-xl cursor-pointer relative group duration-300 hover:bg-violet-200',
        className,
        isActive && 'bg-violet-200',
      ])}
      onClick={() => router.push(route)}
    >
      <div
        className={cn(
          'w-[4px] h-0 group-hover:h-10 transition-height absolute left-[-32px] rounded-r-md duration-300 bg-black',
          isActive && 'h-10'
        )}
      ></div>
      <Icon
        className={cn(
          'stroke-gray-700 group-hover:stroke-violet-700',
          isActive && 'stroke-violet-700'
        )}
      />{' '}
      <span
        className={cn(
          'text-base text-gray-700 transition-colors duration-300 group-hover:text-violet-700',
          isActive && 'text-violet-700'
        )}
      >
        {children}
      </span>
    </div>
  );
}
