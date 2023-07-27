import { cn } from '@/lib/cn';

interface ResponsiveContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function ResponsiveContainer({
  children,
  ...rest
}: ResponsiveContainerProps) {
  return (
    <div
      {...rest}
      className={cn(
        'mx-auto w-full transition-[width] lg:w-[650px] xl:w-[800px]',
        rest.className,
      )}
    >
      {children}
    </div>
  );
}
