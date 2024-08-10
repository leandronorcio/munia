'use client';

import { Feather, GridFeedCards, LogOutCircle, NotificationBell, Profile, Search } from '@/svg_components';
import { useSessionUserData } from '@/hooks/useSessionUserData';
import { useNotificationsCountQuery } from '@/hooks/queries/useNotificationsCountQuery';
import Link from 'next/link';
import { LogoText } from './LogoText';
import { MenuBarItem } from './MenuBarItem';

export function MenuBar() {
  const [user] = useSessionUserData();
  const username = user?.username || 'user-not-found';
  const { data: notificationCount } = useNotificationsCountQuery();

  return (
    <div className="fixed bottom-0 z-[2] flex w-full bg-background/70 shadow-inner backdrop-blur-sm md:sticky md:top-0 md:h-screen md:w-[212px] md:flex-col md:items-start md:bg-inherit md:p-4 md:shadow-none md:backdrop-blur-none">
      <Link href="/" title="Home" className="mb-4 hidden items-center gap-2 md:flex">
        <Feather className="h-12 w-12 stroke-primary" />

        <LogoText className="text-3xl" />
      </Link>
      {[
        {
          title: 'Feed',
          Icon: GridFeedCards,
          route: '/feed',
        },
        {
          title: 'Discover',
          Icon: Search,
          route: '/discover',
        },
        {
          title: 'Notifications',
          Icon: NotificationBell,
          route: '/notifications',
          badge: notificationCount,
        },
        { title: 'My Profile', Icon: Profile, route: `/${username}` },
        {
          title: 'Logout',
          Icon: LogOutCircle,
          route: '/api/auth/signout',
        },
      ].map((item) => (
        <MenuBarItem key={item.title} {...item}>
          {item.title}
        </MenuBarItem>
      ))}
    </div>
  );
}
