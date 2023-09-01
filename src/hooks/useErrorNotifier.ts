import { useToast } from '@/hooks/useToast';

export function useErrorNotifier() {
  const { showToast } = useToast();

  const notifyError = (error: string | unknown, title?: string) => {
    let errorMessage = '';
    if (typeof error === 'string') errorMessage = error;
    if (error instanceof Error) errorMessage = error.message;

    showToast({
      type: 'error',
      title: title || 'Error',
      message: errorMessage,
    });
  };

  return { notifyError };
}
