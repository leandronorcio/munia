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
    <div {...rest} className={cn('w-full sm:w-[600px]', rest.className)}>
      {children}
    </div>
  );
}
