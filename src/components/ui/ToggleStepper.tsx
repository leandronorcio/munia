import { cn } from '@/lib/cn';
import { MouseEventHandler, SVGProps, useRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import {
  AriaToggleButtonProps,
  mergeProps,
  useFocusRing,
  useToggleButton,
} from 'react-aria';
import { useToggleState } from 'react-stately';

const toggle = cva(
  'flex cursor-pointer select-none items-center gap-3 rounded-full px-4 py-2 active:ring-4',
  {
    variants: {
      color: {
        red: 'ring-red-300 hover:bg-red-200 focus:outline-none',
        blue: 'ring-blue-300 hover:bg-blue-200 focus:outline-none',
        purple: 'ring-purple-300 hover:bg-purple-200 focus:outline-none',
      },
    },
    defaultVariants: {
      color: 'purple',
    },
  },
);

const icon = cva('h-6 w-6', {
  variants: {
    color: {
      red: 'fill-red-500 stroke-red-500',
      blue: 'fill-blue-500 stroke-blue-500',
      purple: 'fill-purple-500 stroke-purple-500',
    },
  },
  defaultVariants: {
    color: 'purple',
  },
});

interface ToggleStepperProps
  extends VariantProps<typeof icon>,
    AriaToggleButtonProps {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  quantity: number;
  noun?: string;
}

export function ToggleStepper({
  Icon,
  quantity,
  noun,
  color,
  ...rest
}: ToggleStepperProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const state = useToggleState(rest);
  const { buttonProps } = useToggleButton(rest, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={cn(
        toggle({ color }),
        isFocusVisible && 'ring-2 ring-violet-500 ring-offset-2',
      )}
    >
      <Icon
        width={24}
        height={24}
        className={cn(state.isSelected ? icon({ color }) : 'stroke-black')}
      />
      <p className="text-lg font-semibold text-gray-700">
        {quantity}{' '}
        {noun !== undefined ? (quantity === 1 ? noun : `${noun}s`) : ''}
      </p>
    </button>
  );
}
