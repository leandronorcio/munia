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
        'flex-1 flex justify-center items-center cursor-pointer group hover:bg-violet-700',
        isActive && 'bg-violet-700'
      )}
      onClick={() => router.push(route)}
    >
      {children}
    </div>
  );
}
