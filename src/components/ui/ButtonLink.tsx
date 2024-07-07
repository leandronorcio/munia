import { cn } from '@/lib/cn';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/variants/buttonVariants';
import { ButtonProps } from './Button';

interface ButtonLinkProps extends ButtonProps {
  href: string;
}

export function ButtonLink({ href, children, size, mode, shape, expand }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        buttonVariants({ size, mode, shape, expand }),
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
      )}>
      {children}
    </Link>
  );
}
