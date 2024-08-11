import { ToastContext } from '@/contexts/ToastContext';
import { ToastType } from '@/lib/toast';
import { useContext } from 'react';

export function useToast() {
  const { addToast } = useContext(ToastContext);

  const showToast = ({ title, message, type = 'default' }: ToastType) => {
    if (!addToast) return;
    addToast({ title, message, type }, { timeout: 6000 });
  };

  return { showToast };
}
