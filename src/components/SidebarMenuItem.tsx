'use client';
import { useActiveRouteChecker } from '@/hooks/useActiveRouteChecker';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { cn } from '@/lib/cn';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SVGProps } from 'react';
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

  return (
    <div
      className={cn([
        'relative mt-2 flex h-14 cursor-pointer items-center justify-start gap-4 px-6 text-gray-700',
        isActive ? 'text-violet-700' : 'hover:text-violet-700',
        className,
      ])}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
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
      {isActive && (
        <motion.div
          layoutId="sidebar"
          className="absolute inset-0 h-full w-full rounded-full bg-violet-100"
        ></motion.div>
      )}
      <Icon className="relative z-[1] h-6 w-6 stroke-gray-700" />
      <span className="relative z-[1]">{children}</span>
    </div>
  );
}
