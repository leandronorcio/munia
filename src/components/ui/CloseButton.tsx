import { cn } from '@/lib/cn';
import { Close } from '@/svg_components';

interface CloseButtonProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CloseButton({ ...rest }: CloseButtonProps) {
  return (
    <div
      {...rest}
      className={cn(
        'cursor-pointer rounded-full bg-gray-300/50 p-2 hover:bg-gray-300',
        rest.className,
      )}
    >
      <Close stroke="black" width={24} height={24} />
    </div>
  );
}
