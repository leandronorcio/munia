'use client';
import { useActiveRouteChecker } from '@/hooks/useActiveRouteChecker';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { cn } from '@/lib/cn';
import { signOut } from 'next-auth/react';
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
  const [isActive] = useActiveRouteChecker(route);
  const { confirm } = useBasicDialogs();

  return (
    <div
      className={cn([
        'flex flex-row gap-4 items-center h-14 px-4 mt-2 cursor-pointer relative group duration-300 hover:bg-violet-200',
        className,
        isActive && 'bg-violet-200',
      ])}
      onClick={() => {
        if (route === '/api/auth/signout') {
          confirm({
            title: 'Confirm Logout',
            message: 'Do you really wish to logout?',
            onConfirm: () => signOut({ callbackUrl: '/' }),
          });
        } else {
          router.push(route);
        }
      }}
    >
      <div
        className={cn(
          'w-[4px] h-0 group-hover:h-10 transition-height absolute left-0 rounded-r-lg duration-300 bg-violet-700',
          isActive && 'h-10'
        )}
      ></div>
      <Icon className="stroke-gray-700 w-6 h-6" />{' '}
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
