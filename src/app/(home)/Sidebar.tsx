'use client';
import {
  GridFeedCards,
  LogOutCircle,
  Mail,
  NotificationBell,
  Profile,
  Search,
} from '@/svg_components';
import SidebarMenuItem from './SidebarMenuItem';
import { useSession } from 'next-auth/react';

export default function Sidebar() {
  const { data: session } = useSession();

  const id = session?.user ? session.user.id : '/usernotfound';
  return (
    <div className="hidden md:flex flex-col py-8 px-6 last-child:mt-auto">
      {[
        {
          title: 'News Feed',
          Icon: GridFeedCards,
          route: '/',
        },
        { title: 'My Profile', Icon: Profile, route: `/${id}` },
        { title: 'Messages', Icon: Mail, route: '/messages' },
        {
          title: 'Notifications',
          Icon: NotificationBell,
          route: '/notifications',
        },
        {
          title: 'Discover',
          className: 'mb-auto',
          Icon: Search,
          route: '/discover',
        },
        {
          title: 'Logout',
          className: 'mt-auto',
          Icon: LogOutCircle,
          route: '/api/auth/signout',
        },
      ].map((item, i) => (
        <SidebarMenuItem
          Icon={item.Icon}
          className={item.className}
          route={item.route}
          key={i}
        >
          {item.title}
        </SidebarMenuItem>
      ))}
    </div>
  );
}
