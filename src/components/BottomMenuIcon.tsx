import { useActiveRouteChecker } from '@/hooks/useActiveRouteChecker';
import { cn } from '@/lib/cn';
import { SVGProps } from 'react';

export function BottomMenuIcon({
  Icon,
  route,
}: {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  route: string;
}) {
  const [isActive] = useActiveRouteChecker(route);
  return (
    <Icon
      className={cn(
        'h-6 w-6 stroke-gray-800 transition-all group-hover:scale-125 group-hover:stroke-violet-200',
        isActive && 'scale-125 stroke-violet-200',
      )}
    />
  );
}
