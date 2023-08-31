import { useRef } from 'react';
import { AriaDialogProps, useDialog } from 'react-aria';

interface DialogProps extends AriaDialogProps {
  children: React.ReactNode;
}

export function DatePickerDialog({ children, ...props }: DialogProps) {
  let ref = useRef(null);
  let { dialogProps } = useDialog(props, ref);

  return (
    <div
      {...dialogProps}
      ref={ref}
      className="origin-top scale-95 rounded-xl bg-white p-6 transition-transform focus-within:scale-100"
    >
      {children}
    </div>
  );
}
