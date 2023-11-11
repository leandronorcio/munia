'use client';
import { AriaButtonProps, useButton, useFocusRing } from 'react-aria';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';
import { SVGProps } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import SvgLoading from '@/svg_components/Loading';
import { buttonVariants } from '@/components/ui/variants/buttonVariants';

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
  extends VariantProps<typeof buttonVariants>,
    AriaButtonProps {
  children?: React.ReactNode;
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  loading?: boolean;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, size, mode, shape, expand, Icon, loading, className, ...rest },
  forwardedRef,
) {
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
        [buttonVariants({ size, mode, shape, expand })],
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
});

export default Button;
