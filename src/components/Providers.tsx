'use client';

import { CreatePostModalContextProvider } from '@/contexts/CreatePostModalContext';
import { DialogsContextProvider } from '@/contexts/DialogsContext';
import { ReactQueryProvider } from '@/contexts/ReactQueryProvider';
import { ShouldAnimateContextProvider } from '@/contexts/ShouldAnimateContext';
import { ThemeContextProvider } from '@/contexts/ThemeContext';
import { ToastContextProvider } from '@/contexts/ToastContext';
import { VisualMediaModalContextProvider } from '@/contexts/VisualMediaModalContext';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import React from 'react';

export function Providers({ children, session }: { children: React.ReactNode; session: Session | null }) {
  return (
    <ThemeContextProvider>
      <ToastContextProvider>
        <ReactQueryProvider>
          <SessionProvider session={session}>
            <DialogsContextProvider>
              <VisualMediaModalContextProvider>
                <CreatePostModalContextProvider>
                  <ShouldAnimateContextProvider>{children}</ShouldAnimateContextProvider>
                </CreatePostModalContextProvider>
              </VisualMediaModalContextProvider>
            </DialogsContextProvider>
          </SessionProvider>
        </ReactQueryProvider>
      </ToastContextProvider>
    </ThemeContextProvider>
  );
}
