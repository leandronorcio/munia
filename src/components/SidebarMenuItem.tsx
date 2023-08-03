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
        'group relative mt-2 flex h-14 cursor-pointer flex-row items-center gap-4 px-4 duration-300',
        className,
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
          'transition-height absolute left-0 h-0 w-[4px] rounded-r-lg bg-violet-700 duration-300 group-hover:h-10',
          isActive && 'h-10',
        )}
      ></div>
      <Icon className="h-6 w-6 stroke-gray-700" />{' '}
      <span
        className={cn(
          'text-base text-gray-700 transition-colors duration-300 group-hover:text-violet-700',
          isActive && 'font-semibold text-violet-700',
        )}
      >
        {children}
      </span>
    </div>
  );
}
