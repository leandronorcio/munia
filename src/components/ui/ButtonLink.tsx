'use client';
import { useRouter } from 'next/navigation';
import Button, { ButtonProps } from './Button';

interface ButtonLinkProps extends ButtonProps {
  href: string;
}
export function ButtonLink({
  href,
  children,
  ...buttonProps
}: ButtonLinkProps) {
  const router = useRouter();

  return (
    <Button {...buttonProps} onPress={() => router.push(href)}>
      {children}
    </Button>
  );
}
