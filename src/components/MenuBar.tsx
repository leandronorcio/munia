'use client';
import {
  GridFeedCards,
  LogOutCircle,
  Logo,
  NotificationBell,
  Profile,
  Search,
} from '@/svg_components';
import { MenuBarItem } from './MenuBarItem';
import { useSessionUserData } from '@/hooks/useSessionUserData';
import Link from 'next/link';
import { LogoText } from './LogoText';
import { useNotificationsCountQuery } from '@/hooks/queries/useNotificationsCountQuery';

export function MenuBar() {
  const [user] = useSessionUserData();
  const username = user?.username || 'user-not-found';
  const { data: notificationCount } = useNotificationsCountQuery();

  return (
    <div className="fixed bottom-0 z-[1] flex w-full bg-white/70 shadow-inner backdrop-blur-sm md:sticky md:top-0 md:h-screen md:w-auto md:flex-col md:items-start md:bg-inherit md:p-4 md:shadow-none md:backdrop-blur-none">
      <Link href="/" className="hidden md:block">
        <div className="mb-4 flex items-center gap-2">
          <Logo className="h-12 w-12" />

          <LogoText className="text-3xl" />
        </div>
      </Link>
      {[
        {
          title: 'Feed',
          Icon: GridFeedCards,
          route: '/',
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
      ].map((item, i) => (
        <MenuBarItem key={i} {...item}>
          {item.title}
        </MenuBarItem>
      ))}
    </div>
  );
}