import { useRef } from 'react';
import type { AriaDialogProps } from 'react-aria';
import { useDialog } from 'react-aria';

interface DialogProps extends AriaDialogProps {
  title?: React.ReactNode;
  children: React.ReactNode;
}

export function Dialog({ title, children, ...props }: DialogProps) {
  let ref = useRef(null);
  let { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div
      {...dialogProps}
      ref={ref}
      className="flex flex-col items-center gap-6 outline-none"
    >
      {title && (
        <h3
          {...titleProps}
          className="text-center text-4xl font-bold md:text-5xl"
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
