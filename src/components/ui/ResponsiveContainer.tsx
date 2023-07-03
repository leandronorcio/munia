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
        'w-full mx-auto lg:w-[650px] xl:w-[800px] transition-[width]',
        rest.className
      )}
    >
      {children}
    </div>
  );
}
