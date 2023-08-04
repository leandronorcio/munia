'use client';
import { useActiveRouteChecker } from '@/hooks/useActiveRouteChecker';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { cn } from '@/lib/cn';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SVGProps, useState } from 'react';
import { motion } from 'framer-motion';

export default function SidebarMenuItem({
  children,
  className,
  Icon,
  route,
}: {
  children: React.ReactNode;
  className?: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  route: string;
}) {
  const router = useRouter();
  const [isActive] = useActiveRouteChecker(route);
  const { confirm } = useBasicDialogs();
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn([
        'group relative mt-2 flex h-14 cursor-pointer flex-row items-center gap-4 rounded-lg px-4 duration-300 hover:bg-violet-200',
        className,
      ])}
      onClick={() => {
        if (route === '/api/auth/signout') {
          confirm({
            title: 'Confirm Logout',
            message: 'Do you really wish to logout?',
            onConfirm: () => signOut({ callbackUrl: '/' }),
          });
        } else {
          router.push(route);
        }
      }}
    >
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: hover || isActive ? 1 : 0 }}
        style={{ originY: 0 }}
        className="absolute left-0 h-10 w-[4px] rounded-r-lg bg-violet-700"
      ></motion.div>
      <Icon className="h-6 w-6 stroke-gray-700" />{' '}
      <span
        className={cn(
          'text-base text-gray-700 transition-colors duration-300 group-hover:text-violet-700',
          isActive && 'text-violet-700',
        )}
      >
        {children}
      </span>
    </div>
  );
}
