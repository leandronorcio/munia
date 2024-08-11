import { Feather } from '@/svg_components';
import { LogoText } from '@/components/LogoText';
import Link from 'next/link';
import React from 'react';
import { HomeMobileDropdownMenu } from './HomeMobileDropdownMenu';

function HomeNavLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <h3 className="cursor-pointer px-4 py-3 text-lg font-semibold text-muted-foreground hover:text-primary">
      <Link href={href}>{children}</Link>
    </h3>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full justify-center">
      <div className="w-full max-w-3xl gap-3 py-4 sm:py-8">
        <nav className="flex items-center justify-between px-4 sm:px-0">
          <Link href="/" title="Home page">
            <div className="flex cursor-pointer flex-row items-center justify-center gap-2 sm:pr-5">
              <Feather className="stroke-primary" width={32} height={32} />
              <LogoText className="text-2xl" />
            </div>
          </Link>
          <div className="hidden gap-3 sm:flex">
            <HomeNavLink href="/terms">Terms</HomeNavLink>
            <HomeNavLink href="/privacy-policy">Privacy Policy</HomeNavLink>

            <HomeNavLink href="/login">Login</HomeNavLink>
            <HomeNavLink href="/register">Sign Up</HomeNavLink>
          </div>
          <div className="sm:hidden">
            <HomeMobileDropdownMenu />
          </div>
        </nav>

        {children}
      </div>
    </div>
  );
}
