'use client';
import {
  GridFeedCards,
  Mail,
  NotificationBell,
  Profile,
  Search,
} from '@/svg_components';
import { useSession } from 'next-auth/react';
import { BottomMenuButton } from './BottomMenuButton';
import { BottomMenuIcon } from './BottomMenuIcon';

export function BottomMenu() {
  const { data: session } = useSession();
  const id = session?.user ? session.user.id : '/usernotfound';

  return (
    <div className="w-full h-16 flex flex-row md:hidden bg-violet-400">
      {[
        {
          Icon: GridFeedCards,
          route: '/',
        },
        { Icon: Profile, route: `/${id}` },
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
