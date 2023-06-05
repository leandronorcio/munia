'use client';
import { cn } from '@/lib/cn';
import { useRouter } from 'next/navigation';
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
  return (
    <div
      className={cn([
        'flex flex-row gap-4 items-center h-14 p-6 w-52 rounded-xl cursor-pointer relative group hover:bg-violet-200 duration-300',
        className,
      ])}
      onClick={() => router.push(route)}
    >
      <div className="w-[6px] h-0 group-hover:h-10 transition-height duration-300 bg-violet-700 absolute left-[-32px] rounded-r-md"></div>
      <Icon className="stroke-gray-700 group-hover:stroke-violet-700" />{' '}
      <span className="text-base text-gray-700 transition-colors duration-300 group-hover:text-violet-700">
        {children}
      </span>
    </div>
  );
}
