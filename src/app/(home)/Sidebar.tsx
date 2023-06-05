'use client';
import {
  GridFeedCards,
  LogOutCircle,
  Mail,
  NotificationBell,
  Profile,
  Search,
  TwoPeople,
} from '@/svg_components';
import SidebarMenuItem from './SidebarMenuItem';

export default function Sidebar() {
  return (
    <div className="flex flex-col w-72 pt-8 px-8 last-child:mt-auto">
      {[
        {
          title: 'News Feed',
          Icon: GridFeedCards,
          route: '/',
        },
        { title: 'Profile', Icon: Profile, route: '/profile' },
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
