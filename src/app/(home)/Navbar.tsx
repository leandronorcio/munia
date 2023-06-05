'use client';
import {
  GridFeedCards,
  LogOutCircle,
  Mail,
  NotificationBell,
  TwoPeople,
} from '@/svg_components';
import SidebarMenuItem from './SidebarMenuItem';

export default function Navbar() {
  return (
    <div className="flex flex-col w-72 py-9 px-8 last-child:mt-auto">
      {[
        {
          title: 'News Feed',
          Icon: GridFeedCards,
          route: '/',
        },
        { title: 'Messages', Icon: Mail, route: '/messages' },
        {
          title: 'Notifications',
          Icon: NotificationBell,
          route: '/notifications',
        },
        {
          title: 'Discover',
          className: 'mb-auto',
          Icon: TwoPeople,
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
