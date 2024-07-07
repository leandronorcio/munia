import { useToggleState } from 'react-stately';
import { AriaSwitchProps, useFocusRing, useSwitch, VisuallyHidden } from 'react-aria';
import React, { useMemo, useRef } from 'react';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

interface SwitchProps extends AriaSwitchProps {
  children?: React.ReactNode;
  renderIcon?: () => JSX.Element;
}

export function Switch({ children, renderIcon, ...props }: SwitchProps) {
  const state = useToggleState(props);
  const ref = useRef(null);
  const { inputProps } = useSwitch(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const sprintTransition = useMemo(
    () => ({
      type: 'spring',
      stiffness: 700,
      damping: 30,
    }),
    [],
  );

  return (
    <label className={cn('flex cursor-pointer items-center', props.isDisabled && 'opacity-40')}>
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <div
        className={cn(
          'flex h-9 w-16 rounded-[40px] p-[2px] hover:opacity-90',
          props.isSelected ? 'justify-end bg-primary-accent' : 'justify-start bg-muted',
          isFocusVisible && 'ring-2 ring-violet-500 ring-offset-2',
        )}>
        <motion.div
          layout
          transition={sprintTransition}
          className={cn(
            'grid h-8 w-8 place-items-center rounded-[200px]',
            props.isSelected ? 'bg-primary-foreground' : 'bg-muted-foreground',
          )}>
          {renderIcon !== undefined && renderIcon()}
        </motion.div>
      </div>
      {children}
    </label>
  );
}
