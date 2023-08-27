import { useRef } from 'react';
import type { AriaDialogProps } from 'react-aria';
import { useDialog } from 'react-aria';
import Button from './ui/Button';
import { Close } from '@/svg_components';
import { motion } from 'framer-motion';

interface DialogProps extends AriaDialogProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: React.ReactNode;
}

export function Dialog({ children, onClose, title, ...props }: DialogProps) {
  let ref = useRef(null);
  let { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <motion.div
      initial={{ y: '-48px' }}
      animate={{ y: '0' }}
      exit={{ y: '-48px' }}
      className="flex h-full w-full items-center justify-center"
    >
      <div
        {...dialogProps}
        ref={ref}
        className="relative my-auto w-full gap-6 rounded-t-3xl bg-white px-5 py-14 focus:outline-none md:w-[600px] md:rounded-3xl md:px-32 md:py-24"
      >
        <div className="flex flex-col items-center gap-6 outline-none">
          <div className="absolute right-6 top-6 md:right-8 md:top-8">
            <Button Icon={Close} mode="ghost" onPress={onClose} />
          </div>
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
      </div>
    </motion.div>
  );
}
