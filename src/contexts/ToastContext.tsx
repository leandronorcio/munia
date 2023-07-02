'use client';
import { Toast } from '@/components/Toast';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

export interface ToastType {
  title: string;
  message?: string;
  duration?: number;
  type?: 'default' | 'success' | 'warning' | 'error';
}

const ToastDefault: ToastType = {
  title: '',
  message: '',
  duration: 5000,
  type: 'default',
};

const ToastContextData = createContext<{
  shown: boolean;
  toast: ToastType;
}>({
  shown: false,
  toast: ToastDefault,
});
const ToastContextApi = createContext<{
  setShown: Dispatch<SetStateAction<boolean>>;
  setToast: Dispatch<SetStateAction<ToastType>>;
}>({
  setShown: () => {},
  setToast: () => {},
});

function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [shown, setShown] = useState(false);
  const [toast, setToast] = useState<ToastType>(ToastDefault);

  const memoizedContextApiValue = useMemo(() => ({ setShown, setToast }), []);
  return (
    <ToastContextData.Provider value={{ shown, toast }}>
      <ToastContextApi.Provider value={memoizedContextApiValue}>
        <Toast />
        {children}
      </ToastContextApi.Provider>
    </ToastContextData.Provider>
  );
}

export { ToastContextData, ToastContextApi, ToastContextProvider };
