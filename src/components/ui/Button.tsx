'use client';

import { AriaButtonProps, useButton, useFocusRing } from 'react-aria';
import { forwardRef, ReactNode, SVGProps } from 'react';
import { cn } from '@/lib/cn';
import { VariantProps } from 'class-variance-authority';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import SvgLoading from '@/svg_components/Loading';
import { buttonIconVariants, buttonVariants } from '@/components/ui/variants/buttonVariants';

export type ButtonProps = VariantProps<typeof buttonVariants> &
  AriaButtonProps & {
    children?: ReactNode;
    Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    loading?: boolean;
    className?: string;
    iconClassName?: string;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, size, mode, shape, expand, Icon, loading, className, iconClassName, ...rest }, forwardedRef) => {
    const iconOnly = children === undefined;
    // Support forwarded refs: https://github.com/adobe/react-spectrum/pull/2293#discussion_r714337674
    const ref = useObjectRef(forwardedRef);
    const { buttonProps } = useButton(rest, ref);
    const { isFocusVisible, focusProps } = useFocusRing();

    return (
      <button
        type="button"
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className={cn(
          [buttonVariants({ size, mode, shape, expand })],
          iconOnly && 'rounded-full p-3',
          isFocusVisible && 'ring-2 ring-violet-500 ring-offset-2',
          className,
        )}
        disabled={buttonProps.disabled || loading}>
        {!loading ? (
          Icon && <Icon className={cn(buttonIconVariants({ size, mode }), iconClassName)} />
        ) : (
          <SvgLoading className={cn(['animate-spin'], buttonIconVariants({ size, mode }))} />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
