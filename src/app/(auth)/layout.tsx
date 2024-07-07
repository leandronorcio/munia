import { ArrowChevronBack } from '@/svg_components';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid h-screen place-items-center">
      <div className="absolute left-3 top-4 sm:left-6 sm:top-6">
        <Link href="/" className="group flex items-center gap-2 sm:gap-4">
          <ArrowChevronBack className="stroke-foreground group-hover:stroke-muted-foreground" />
          <span className="group-hover:text-muted-foreground">Back to Home</span>
        </Link>
      </div>
      <div className="w-[320px] md:w-[428px]">{children}</div>
    </div>
  );
}
