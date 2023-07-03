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

export default function BottomMenu() {
  const { data: session } = useSession();
  const id = session?.user ? session.user.id : '/not-found';

  return (
    <div className="transition-[bottom] duration-500 w-full fixed left-0 bottom-0 z-[1] md:-bottom-16 h-14 flex flex-row bg-violet-500 shadow-2xl">
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
