'use client';
import { ToastRegion } from '@/components/ui/ToastRegion';
import { ToastState, useToastState } from '@react-stately/toast';
import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useMemo } from 'react';

export interface ToastType {
  title: string;
  message?: string;
  type?: 'default' | 'success' | 'warning' | 'error';
}

export const ToastContext = createContext<{
  addToast: ToastState<ToastType>['add'] | null;
}>({
  addToast: null,
});

export function ToastContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let state = useToastState<ToastType>({
    maxVisibleToasts: 5,
  });

  // This prevents unncessesary rerenders of the `ToastContext` consumers
  // Even if the states change, the consumers will not rerender
  const memoizedValue = useMemo(
    () => ({
      addToast: state.add,
    }),
    [],
  );

  return (
    <ToastContext.Provider value={memoizedValue}>
      <AnimatePresence>
        {state.visibleToasts.length > 0 && (
          <motion.div
            key="toast-region"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ToastRegion state={state} />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </ToastContext.Provider>
  );
}
