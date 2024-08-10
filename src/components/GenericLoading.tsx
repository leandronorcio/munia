import SvgLoading from '@/svg_components/Loading';
import React from 'react';

export function GenericLoading({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-5">
      <div>
        <SvgLoading className="h-12 w-12 animate-spin stroke-foreground" />
      </div>
      <p className="text-lg">{children || 'Loading page'}</p>
    </div>
  );
}
