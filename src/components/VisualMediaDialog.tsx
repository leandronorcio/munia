import React, { useRef } from 'react';
import { AriaDialogProps, useDialog } from 'react-aria';

interface VisualMediaDialogProps extends AriaDialogProps {
  children: React.ReactNode;
}

export function VisualMediaDialog({ children, ...rest }: VisualMediaDialogProps) {
  const ref = useRef(null);
  const { dialogProps } = useDialog(rest, ref);

  return (
    <div {...dialogProps} ref={ref} className="h-screen w-full">
      {children}
    </div>
  );
}
