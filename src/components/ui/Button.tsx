'use client';
import { AriaButtonProps, useButton, useFocusRing } from 'react-aria';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { SVGProps } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import SvgLoading from '@/svg_components/Loading';

const button = cva(
  'group flex flex-row items-center justify-center font-semibold transition-transform focus:outline-none active:scale-95 active:ring-4 disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      size: {
        huge: 'gap-4 rounded-2xl px-8 py-5 text-lg',
        large: 'gap-4 rounded-2xl px-8 py-5 text-base',
        medium: 'gap-3 rounded-xl px-6 py-4 text-base',
        small: 'gap-3 rounded-lg px-4 py-[9px] text-[13px]',
      },
      mode: {
        primary:
          'border-2 border-transparent bg-primary text-primary-foreground hover:bg-primary-accent active:ring-primary/30',
        secondary:
          'border-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 active:ring-secondary-foreground/20',
        subtle:
          'border-2 border-primary-accent bg-transparent text-primary-accent hover:border-primary-accent/70 hover:text-primary-accent/90 active:ring-primary-accent/30',
        ghost:
          'font-semibold text-muted-foreground hover:bg-muted/30 active:ring-muted-foreground/20',
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
      primary: 'stroke-primary-foreground',
      secondary: 'stroke-secondary-foreground',
      subtle: 'stroke-primary-accent',
      ghost: 'stroke-muted-foreground',
    },
  },
  defaultVariants: {
    size: 'medium',
    mode: 'primary',
  },
});

export interface ButtonProps
  extends VariantProps<typeof button>,
    AriaButtonProps {
  children?: React.ReactNode;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  loading?: boolean;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, size, mode, shape, expand, Icon, loading, className, ...rest },
    forwardedRef,
  ) => {
    const iconOnly = children === undefined;
    // Support forwarded refs: https://github.com/adobe/react-spectrum/pull/2293#discussion_r714337674
    const ref = useObjectRef(forwardedRef);
    const { buttonProps } = useButton(rest, ref);
    const { isFocusVisible, focusProps } = useFocusRing();

    return (
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className={cn(
          [button({ size, mode, shape, expand })],
          iconOnly && 'rounded-full p-3',
          isFocusVisible && 'ring-2 ring-violet-500 ring-offset-2',
          className,
        )}
        disabled={buttonProps.disabled || loading}
      >
        {!loading ? (
          Icon && <Icon className={cn(icon({ size, mode }))} />
        ) : (
          <SvgLoading className={cn(['animate-spin '], icon({ size, mode }))} />
        )}
        {children}
      </button>
    );
  },
);

export default Button;
