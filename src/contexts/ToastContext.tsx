'use client';

import { ToastRegion } from '@/components/ui/ToastRegion';
import { ToastState, useToastState } from '@react-stately/toast';
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
  const state = useToastState<ToastType>({
    maxVisibleToasts: 5,
  });

  // This prevents unncessesary rerenders of the `ToastContext` consumers
  // Even if the states change, the consumers will not rerender
  const memoizedValue = useMemo(
    () => ({
      addToast: state.add,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Don't add `state.add` here, otherwise our memoization technique won't work
  );

  return (
    <ToastContext.Provider value={memoizedValue}>
      {state.visibleToasts.length > 0 && <ToastRegion state={state} />}
      {children}
    </ToastContext.Provider>
  );
}
