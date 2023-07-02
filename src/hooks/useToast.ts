import { ToastContextApi, ToastType } from '@/contexts/ToastContext';
import { useContext } from 'react';

export function useToast() {
  const { setShown, setToast } = useContext(ToastContextApi);

  const showToast = ({
    title,
    message = '',
    duration = 5000,
    type = 'default',
  }: ToastType) => {
    setToast({ title, message, duration, type });
    setShown(true);
    setTimeout(() => {
      setTimeout(() => setShown(false));
    }, duration);
  };

  return { showToast };
}
