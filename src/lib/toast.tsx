export interface ToastType {
  title: string;
  message?: string;
  type?: 'default' | 'success' | 'warning' | 'error';
}

export const toastVariants = {
  initial: { opacity: 0, x: '80%' },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: '80%' },
};

export const toastColors = {
  default: {
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    border: 'border-border',
    icon: 'stroke-primary-foreground/70',
  },
  success: {
    bg: 'bg-success',
    text: 'text-success-foreground',
    border: 'border-success-foreground',
    icon: 'stroke-success-foreground/70',
  },
  warning: {
    bg: 'bg-warning',
    text: 'text-warning-foreground',
    border: 'border-warning-foreground',
    icon: 'stroke-warning-foreground/70',
  },
  error: {
    bg: 'bg-destructive',
    text: 'text-destructive-foreground',
    border: 'border-border',
    icon: 'stroke-destructive-foreground/70',
  },
};
