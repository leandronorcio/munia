'use client';
import { useActiveRouteChecker } from '@/hooks/useActiveRouteChecker';
import { cn } from '@/lib/cn';
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

  return (
    <div
      className={cn(
        'group flex flex-1 cursor-pointer items-center justify-center hover:bg-violet-100',
        isActive && 'bg-violet-100',
      )}
      onClick={() => router.push(route)}
    >
      {children}
    </div>
  );
}
