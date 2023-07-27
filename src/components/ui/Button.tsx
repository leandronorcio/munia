'use client';
import { cn } from '@/lib/cn';
import { SVGProps } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import SvgLoader from '@/svg_components/Loader';

const button = cva(
  'group flex flex-row items-center justify-center font-semibold disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      size: {
        huge: 'gap-4 rounded-2xl px-8 py-5 text-lg active:ring-8',
        large: 'gap-4 rounded-2xl px-8 py-5 text-base active:ring-8',
        medium: 'gap-3 rounded-xl px-6 py-4 text-base active:ring-8',
        small: 'gap-3 rounded-lg px-4 py-[9px] text-[13px] active:ring-4',
      },
      mode: {
        primary:
          'border-2 border-transparent bg-violet-600 text-white ring-violet-400 hover:bg-violet-700',
        secondary:
          'border-2 border-violet-600 bg-transparent text-violet-600  ring-violet-400  hover:border-violet-800 hover:text-violet-800',
        subtle:
          'border-2 border-violet-200 bg-transparent text-violet-800 ring-violet-200 hover:border-violet-400 hover:text-violet-900',
        ghost: 'font-semibold text-gray-600 hover:text-gray-900 active:ring-0',
      },
      expand: {
        full: 'w-full',
        half: 'w-1/2',
        none: '',
      },
      shape: {
        pill: 'rounded-full',
        rounded: '',
      },
    },
    defaultVariants: {
      size: 'medium',
      mode: 'primary',
      expand: 'none',
      shape: 'rounded',
    },
  },
);

const icon = cva('', {
  variants: {
    size: {
      huge: 'h-6 w-6',
      large: 'h-6 w-6',
      medium: 'h-6 w-6',
      small: 'h-5 w-5',
    },
    mode: {
      primary: 'stroke-white',
      secondary: 'stroke-violet-600 group-hover:stroke-violet-800',
      ghost: 'stroke-gray-600 group-hover:stroke-gray-900',
      subtle: 'stroke-violet-800 group-hover:stroke-violet-900',
    },
  },
  defaultVariants: {
    size: 'medium',
    mode: 'primary',
  },
});

interface ButtonProps
  extends VariantProps<typeof button>,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  loading?: boolean;
}

export default function Button({
  children,
  size,
  mode,
  shape,
  expand,
  Icon,
  loading,
  ...rest
}: ButtonProps) {
  const iconOnly = children === undefined;

  return (
    <button
      className={cn(
        [button({ size, mode, shape, expand })],
        iconOnly && 'rounded-full p-3',
      )}
      disabled={rest.disabled || (loading && true)}
      type="button"
      {...rest}
    >
      {!loading ? (
        Icon && (
          <Icon height={24} width={24} className={cn(icon({ size, mode }))} />
        )
      ) : (
        <SvgLoader
          className={cn(
            ['animate-spin fill-violet-800 text-violet-300'],
            icon({ size, mode }),
          )}
        />
      )}
      {children && <span>{children}</span>}
    </button>
  );
}
