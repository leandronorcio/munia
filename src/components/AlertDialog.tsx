import React, { useMemo, useRef } from 'react';
import type { AriaDialogProps } from 'react-aria';
import { useDialog } from 'react-aria';
import { Close } from '@/svg_components';
import { motion } from 'framer-motion';
import Button from './ui/Button';

interface DialogProps extends AriaDialogProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: React.ReactNode;
}

export function AlertDialog({ children, onClose, title, ...props }: DialogProps) {
  const ref = useRef(null);
  const { dialogProps, titleProps } = useDialog(props, ref);

  const motionVariants = useMemo(
    () => ({
      initial: { y: '-48px' },
      animate: { y: '0' },
      exit: { y: '-48px' },
    }),
    [],
  );
  return (
    <motion.div
      variants={motionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full w-full items-end justify-center md:items-center">
      <div
        {...dialogProps}
        ref={ref}
        className="relative w-full gap-6 rounded-t-3xl border border-border bg-card px-5 py-14 focus:outline-none md:w-[600px] md:rounded-3xl md:px-32 md:py-24">
        <div className="flex flex-col items-center gap-6 outline-none">
          <div className="absolute right-2 top-2 md:right-8 md:top-8">
            <Button Icon={Close} mode="ghost" onPress={onClose} />
          </div>
          {title && (
            <h3 {...titleProps} className="text-center text-4xl font-bold md:text-5xl">
              {title}
            </h3>
          )}
          {children}
        </div>
      </div>
    </motion.div>
  );
}
