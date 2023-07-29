import { useToast } from '@/hooks/useToast';

export function errorNotifer(error: string | unknown, title?: string) {
  const { showToast } = useToast();

  let errorMessage = '';
  if (typeof error === 'string') errorMessage = error;
  if (error instanceof Error) errorMessage = error.message;

  showToast({
    type: 'error',
    title: title || 'Something Went Wrong',
    message: errorMessage,
  });
}
