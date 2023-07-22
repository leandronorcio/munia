'use client';
import { cn } from '@/lib/cn';
import { SVGProps } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  mode?: 'primary' | 'secondary' | 'ghost' | 'subtle';
  size?: Sizes;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  shape?: 'pill' | 'rounded';
  expand?: 'full' | 'half';
  loading?: boolean;
}
type Sizes = 'huge' | 'large' | 'medium' | 'small';
const sizes = {
  huge: 'px-8 py-5 gap-4 text-lg rounded-2xl active:ring-8',
  large: 'px-8 py-5 gap-4 text-base rounded-2xl active:ring-8',
  medium: 'px-6 py-4 gap-3 text-base rounded-xl active:ring-8',
  small: 'px-4 py-[9px] gap-3 text-[13px] rounded-lg active:ring-4',
};
const modes = {
  primary:
    'bg-violet-600 dark:bg-violet-400 text-white dark:text-violet-800 hover:bg-violet-700 dark:hover:bg-violet-300 ring-violet-400 dark:active:ring-violet-900',
  secondary:
    'border-2 border-violet-600 dark:border-violet-400 text-violet-600 dark:text-violet-400 hover:border-violet-800 dark:hover:border-violet-300 hover:text-violet-800 dark:hover:text-violet-300 ring-violet-400 dark:active:ring-violet-900',
  ghost: 'font-semibold text-gray-600 hover:text-gray-900 active:ring-0',
  subtle:
    'bg-transparent border-2 border-violet-200 hover:border-violet-400 text-violet-800 hover:text-violet-900 ring-violet-200',
};
const iconModes = {
  primary: 'stroke-white dark:stroke-violet-800',
  secondary:
    'stroke-violet-600 dark:stroke-violet-400 group-hover:stroke-violet-800 dark:group-hover:stroke-violet-300',
  ghost: 'stroke-gray-600 group-hover:stroke-gray-900',
  subtle: 'stroke-violet-800 group-hover:stroke-violet-900',
};

export default function Button({
  children,
  mode = 'primary',
  size = 'medium',
  shape = 'rounded',
  expand = undefined,
  Icon,
  loading,
  ...rest
}: ButtonProps) {
  const iconOnly = children === undefined;

  return (
    <button
      className={cn([
        'flex flex-row items-center justify-center font-semibold group',
        sizes[size],
        modes[mode],
        shape === 'pill' && 'rounded-full',
        expand === 'full' && 'w-full',
        expand === 'half' && 'w-1/2',
        iconOnly && 'px-3 py-3 rounded-full',
        (rest.disabled || loading) && 'opacity-50',
      ])}
      disabled={rest.disabled || (loading && true)}
      type="button"
      {...rest}
    >
      {!loading ? (
        Icon && (
          <Icon
            width={24}
            height={24}
            className={cn([size === 'small' && 'scale-75', iconModes[mode]])}
          />
        )
      ) : (
        <svg
          aria-hidden="true"
          className={cn([
            size === 'small' ? 'w-4 h-4' : 'w-6 h-6',
            'animate-spin text-violet-300 fill-violet-800',
          ])}
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      )}
      {children && <span>{children}</span>}
    </button>
  );
}
