'use client';
import {
  GridFeedCards,
  LogOutCircle,
  Mail,
  NotificationBell,
  Profile,
  Search,
} from '@/svg_components';
import { BottomMenuButton } from './BottomMenuButton';
import { BottomMenuIcon } from './BottomMenuIcon';
import { useSessionUserData } from '@/hooks/useSessionUserData';

export default function BottomMenu() {
  const [user] = useSessionUserData();
  const username = user?.username || 'user-not-found';

  return (
    <div className="flex h-12 w-full flex-row bg-white/70 shadow-inner backdrop-blur-sm">
      {[
        {
          Icon: GridFeedCards,
          route: '/',
        },
        {
          Icon: Search,
          route: '/discover',
        },
        { title: 'Messages', Icon: Mail, route: '/messages' },
        {
          Icon: NotificationBell,
          route: '/notifications',
        },
        { Icon: Profile, route: `/${username}` },
        { Icon: LogOutCircle, route: `/api/auth/signout` },
      ].map((item) => (
        <BottomMenuButton route={item.route} key={item.route}>
          <BottomMenuIcon route={item.route} Icon={item.Icon} />
        </BottomMenuButton>
      ))}
    </div>
  );
}
