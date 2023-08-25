import type { OverlayTriggerState } from 'react-stately';
import type { AriaPopoverProps } from '@react-aria/overlays';
import { usePopover, DismissButton, Overlay } from '@react-aria/overlays';
import { cn } from '@/lib/cn';
import { useRef } from 'react';

interface PopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  children: React.ReactNode;
  state: OverlayTriggerState;
  className?: string;
}

export function Popover(props: PopoverProps) {
  let ref = useRef<HTMLDivElement>(null);
  let { state, children } = props;

  let { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef: ref,
    },
    state,
  );

  return (
    <Overlay>
      <div {...underlayProps} className="fixed inset-0 z-10" />
      <div
        {...popoverProps}
        ref={ref}
        className={cn('z-[1] mt-1', props.className)}
      >
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
