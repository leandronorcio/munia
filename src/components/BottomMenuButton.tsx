'use client';
import { useActiveRouteChecker } from '@/hooks/useActiveRouteChecker';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { cn } from '@/lib/cn';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function BottomMenuButton({
  children,
  route,
}: {
  children: React.ReactNode;
  route: string;
}) {
  const [isActive] = useActiveRouteChecker(route);
  const router = useRouter();
  const { confirm } = useBasicDialogs();

  return (
    <div
      className={cn(
        'group flex flex-1 cursor-pointer items-center justify-center hover:bg-violet-100',
        isActive && 'bg-violet-100',
      )}
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
      {children}
    </div>
  );
}
