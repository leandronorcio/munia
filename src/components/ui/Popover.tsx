import type { OverlayTriggerState } from 'react-stately';
import type { AriaPopoverProps } from '@react-aria/overlays';
import * as React from 'react';
import { usePopover, DismissButton, Overlay } from '@react-aria/overlays';
import { cn } from '@/lib/cn';

interface PopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  children: React.ReactNode;
  state: OverlayTriggerState;
  className?: string;
  popoverRef?: React.RefObject<HTMLDivElement>;
}

export function Popover(props: PopoverProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { popoverRef = ref, state, children, className, isNonModal } = props;

  const { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef,
    },
    state,
  );

  return (
    <Overlay>
      {!isNonModal && <div {...underlayProps} className="fixed inset-0" />}
      <div {...popoverProps} ref={popoverRef} className={cn('z-10 mt-2', className)}>
        {!isNonModal && <DismissButton onDismiss={state.close} />}
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
