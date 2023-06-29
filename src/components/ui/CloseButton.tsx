import { cn } from '@/lib/cn';
import { Close } from '@/svg_components';

interface CloseButtonProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CloseButton({ ...rest }: CloseButtonProps) {
  return (
    <div
      {...rest}
      className={cn(
        'p-2 bg-gray-300/50 hover:bg-gray-300 rounded-full cursor-pointer',
        rest.className
      )}
    >
      <Close stroke="black" width={24} height={24} />
    </div>
  );
}
