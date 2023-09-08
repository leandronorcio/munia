import { useActiveRouteChecker } from '@/hooks/useActiveRouteChecker';
import { useDialogs } from '@/hooks/useDialogs';
import { cn } from '@/lib/cn';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SVGProps } from 'react';
import { Badge } from './ui/Badge';
import { ButtonNaked } from './ui/ButtonNaked';

export function MenuBarItem({
  children,
  Icon,
  route,
  badge,
}: {
  children: React.ReactNode;
  className?: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  route: string;
  badge?: number;
}) {
  const router = useRouter();
  const [isActive] = useActiveRouteChecker(route);
  const { confirm } = useDialogs();

  return (
    <ButtonNaked
      className="group relative flex h-14 flex-1 cursor-pointer flex-row items-center justify-center px-4 hover:bg-primary-accent/30 md:mt-2 md:flex-none md:rounded-lg md:last:mt-auto"
      onPress={() => {
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
      <div
        className={cn(
          'absolute left-0 hidden h-10 w-[4px] scale-y-0 rounded-r-lg bg-primary transition-transform group-hover:scale-y-100 md:block',
          isActive && 'scale-y-100',
        )}
      ></div>
      <div
        className={cn(
          'absolute bottom-0 h-[4px] w-[70%] scale-x-0 rounded-t-lg bg-primary transition-transform group-hover:scale-x-100 md:hidden',
          isActive && 'scale-x-100',
        )}
      ></div>
      <div className="relative md:mr-3">
        <Icon className="h-6 w-6 stroke-muted-foreground" />
        {badge !== undefined && badge !== 0 && (
          <div className="absolute right-[-25%] top-[-50%]">
            <Badge>{badge}</Badge>
          </div>
        )}
      </div>
      <p
        className={cn(
          'hidden text-base transition-colors duration-300 md:block',
          isActive && 'font-bold text-primary-accent',
        )}
      >
        {children}
      </p>
    </ButtonNaked>
  );
}
