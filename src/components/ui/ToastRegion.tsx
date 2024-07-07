import type { AriaToastRegionProps } from '@react-aria/toast';
import type { ToastState } from '@react-stately/toast';
import { useToastRegion } from '@react-aria/toast';
import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastType, toastVariants } from '@/lib/toast';
import { Toast } from './Toast';

interface ToastRegionProps<T> extends AriaToastRegionProps {
  state: ToastState<T>;
}

export function ToastRegion<T extends ToastType>({ state, ...props }: ToastRegionProps<T>) {
  const ref = useRef(null);
  const { regionProps } = useToastRegion(props, state, ref);

  return (
    <div
      {...regionProps}
      ref={ref}
      className="fixed bottom-16 right-3 z-40 flex max-w-[320px] flex-col gap-3 focus:outline-none md:bottom-6 md:right-6">
      <AnimatePresence>
        {state.visibleToasts.map((toast) => (
          <motion.div
            key={`${toast.key}-motion-container`}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit">
            <Toast key={toast.key} toast={toast} state={state} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
