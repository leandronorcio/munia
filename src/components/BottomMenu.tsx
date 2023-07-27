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
    <div className="flex h-14 w-full flex-row bg-violet-100 shadow-inner">
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
