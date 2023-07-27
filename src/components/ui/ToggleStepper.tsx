import { cn } from '@/lib/cn';
import { ClassValue } from 'clsx';
import { MouseEventHandler, SVGProps } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

const toggle = cva(
  'flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2 active:ring-4',
  {
    variants: {
      color: {
        red: 'ring-red-300 hover:bg-red-200 ',
        blue: 'ring-blue-300 hover:bg-blue-200',
        purple: 'ring-purple-300 hover:bg-purple-200',
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

export function ToggleStepper({
  onClick,
  Icon,
  isActive,
  quantity,
  noun,
  color,
}: {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  onClick: MouseEventHandler<HTMLDivElement>;
  isActive: boolean;
  quantity: number;
  noun: string;
} & VariantProps<typeof icon>) {
  return (
    <div className={cn(toggle({ color }))} onClick={onClick}>
      <Icon
        width={24}
        height={24}
        className={cn(isActive ? icon({ color }) : 'stroke-black')}
      />
      <p className="hidden text-lg font-semibold text-gray-700 sm:block">
        {quantity} {quantity === 1 ? noun : `${noun}s`}
      </p>
    </div>
  );
}
