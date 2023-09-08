import { cn } from '@/lib/cn';
import { ButtonNaked } from './ui/ButtonNaked';
import { capitalize } from 'lodash';
import { Ellipse } from '@/svg_components';
import { AriaButtonProps } from 'react-aria';

export function TabButton({
  isActive,
  title,
  ...rest
}: {
  isActive?: boolean;
  title: string;
} & AriaButtonProps) {
  return (
    <>
      <ButtonNaked
        aria-label={title}
        className="flex cursor-pointer flex-col items-center gap-2"
        {...rest}
      >
        <h2
          className={cn(
            isActive
              ? 'font-bold text-foreground'
              : 'font-semibold text-muted-foreground hover:text-muted-foreground/70',
          )}
        >
          {capitalize(title)}
        </h2>
        {isActive && <div className="h-[2px] w-full bg-foreground"></div>}
      </ButtonNaked>
    </>
  );
}
