import React, { useRef } from 'react';
import { AriaDialogProps, useDialog } from 'react-aria';
import SvgClose from '@/svg_components/Close';
import { ResponsiveContainer } from './ui/ResponsiveContainer';
import Button from './ui/Button';

interface GenericDialogProps extends AriaDialogProps {
  title: string;
  handleClose: () => void;
  children: React.ReactNode;
}

export function GenericDialog({ title, handleClose, children, ...props }: GenericDialogProps) {
  const dialogRef = useRef(null);
  const { dialogProps, titleProps } = useDialog(props, dialogRef);

  return (
    <div
      {...dialogProps}
      ref={dialogRef}
      className="flex h-full w-full flex-col items-center overflow-y-auto p-2 sm:justify-center">
      <ResponsiveContainer>
        <div className="mb-6 rounded-xl border border-border bg-popover">
          <div className="relative mb-4 rounded-t-xl border-b border-b-border bg-card py-4">
            <h3 {...titleProps} className="text-center text-lg font-semibold">
              {title}
            </h3>
            <div className="absolute right-3 top-[50%] translate-y-[-50%]">
              <Button onPress={handleClose} Icon={SvgClose} mode="ghost" size="small" />
            </div>
          </div>
          {children}
        </div>
      </ResponsiveContainer>
    </div>
  );
}
