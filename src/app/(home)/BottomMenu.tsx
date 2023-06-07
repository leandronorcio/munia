'use client';
import { useActiveRouteChecker } from '@/hooks/useActiveRouteChecker';
import { cn } from '@/lib/cn';
import {
  GridFeedCards,
  Mail,
  NotificationBell,
  Profile,
  Search,
} from '@/svg_components';
import { useRouter } from 'next/navigation';
import { SVGProps } from 'react';

function BottomMenuButton({
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
function BottomMenuIcon({
  Icon,
  route,
}: {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  route: string;
}) {
  const [isActive] = useActiveRouteChecker(route);
  return (
    <Icon
      className={cn(
        'stroke-white w-6 h-6 group-hover:stroke-violet-200 group-hover:scale-125 transition-all',
        isActive && 'stroke-violet-200 scale-125'
      )}
    />
  );
}

export async function BottomMenu() {
  return (
    <div className="w-full h-16 flex flex-row md:hidden bg-violet-400">
      {[
        {
          Icon: GridFeedCards,
          route: '/',
        },
        { Icon: Profile, route: '/profile' },
        { title: 'Messages', Icon: Mail, route: '/messages' },
        {
          Icon: NotificationBell,
          route: '/notifications',
        },
        {
          Icon: Search,
          route: '/discover',
        },
      ].map((item) => (
        <BottomMenuButton route={item.route} key={item.route}>
          <BottomMenuIcon route={item.route} Icon={item.Icon} />
        </BottomMenuButton>
      ))}
    </div>
  );
}
