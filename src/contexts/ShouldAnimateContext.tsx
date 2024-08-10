'use client';

import React, { createContext, useEffect, useMemo, useState } from 'react';

/**
 * This context detects browser's back button click,
 * if it was just clicked, `shouldAnimate` must be `false`
 * to prevent animating components when the user navigates back,
 * this helps restore the scroll of the page to navigate back to.
 */
export const ShouldAnimateContext = createContext<{
  shouldAnimate: boolean;
  setShouldAnimate: React.Dispatch<React.SetStateAction<boolean>>;
}>({ shouldAnimate: true, setShouldAnimate: () => {} });

export function ShouldAnimateContextProvider({ children }: { children: React.ReactNode }) {
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const value = useMemo(() => ({ shouldAnimate, setShouldAnimate }), [shouldAnimate]);

  useEffect(() => {
    const onPop = () => {
      setShouldAnimate(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (!shouldAnimate)
      setTimeout(() => {
        setShouldAnimate(true);
      }, 200);
  }, [shouldAnimate]);

  return <ShouldAnimateContext.Provider value={value}>{children}</ShouldAnimateContext.Provider>;
}
