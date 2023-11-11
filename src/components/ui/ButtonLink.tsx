import { cn } from '@/lib/cn';
import { ButtonProps, buttonVariants } from './Button';
import Link from 'next/link';

interface ButtonLinkProps extends ButtonProps {
  href: string;
}
export function ButtonLink({
  href,
  children,
  size,
  mode,
  shape,
  expand,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ size, mode, shape, expand }),
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
      )}
    >
      {children}
    </Link>
  );
}
