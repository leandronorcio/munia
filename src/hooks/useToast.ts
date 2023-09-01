import { ToastContext, ToastType } from '@/contexts/ToastContext';
import { useContext } from 'react';

export function useToast() {
  const { addToast } = useContext(ToastContext);

  const showToast = ({ title, message = '', type = 'default' }: ToastType) => {
    if (!addToast) return;
    addToast({ title, message, type }, { timeout: 5000 });
  };

  return { showToast };
}
