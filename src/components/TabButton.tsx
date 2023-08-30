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
    <div className=" px-3 py-4">
      <ButtonNaked
        aria-label={title}
        className="flex cursor-pointer flex-col items-center gap-2"
        {...rest}
      >
        <h2
          className={cn(
            'text-xl font-semibold',
            isActive ? 'text-black' : 'text-gray-500 hover:text-gray-700',
          )}
        >
          {capitalize(title)}
        </h2>
        {isActive && <Ellipse width={8} height={8} />}
      </ButtonNaked>
    </div>
  );
}
