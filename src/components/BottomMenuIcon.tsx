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
        'stroke-gray-800 w-6 h-6 group-hover:stroke-violet-200 group-hover:scale-125 transition-all',
        isActive && 'stroke-violet-200 scale-125'
      )}
    />
  );
}
