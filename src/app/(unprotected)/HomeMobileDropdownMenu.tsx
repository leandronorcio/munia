'use client';

import { DropdownMenuButton } from '@/components/ui/DropdownMenuButton';
import { HamburgerMenu } from '@/svg_components';
import { useRouter } from 'next/navigation';
import { Key, useCallback } from 'react';
import { Item, Section } from 'react-stately';

export function HomeMobileDropdownMenu() {
  const router = useRouter();
  const onAction = useCallback((key: Key) => router.push(key as string), [router]);
  return (
    <DropdownMenuButton key="home-dropdown-menu" label="Home dropdown menu" onAction={onAction} Icon={HamburgerMenu}>
      <Section>
        <Item key="/terms">Terms</Item>
        <Item key="/privacy-policy">Privacy Policy</Item>
        <Item key="/login">Login</Item>
        <Item key="/sign-up">Sign Up</Item>
      </Section>
    </DropdownMenuButton>
  );
}
