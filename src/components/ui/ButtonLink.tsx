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
    <Link href={href} className={buttonVariants({ size, mode, shape, expand })}>
      {children}
    </Link>
  );
}
