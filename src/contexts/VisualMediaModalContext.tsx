'use client';

import React, { Dispatch, SetStateAction, createContext, useMemo, useState } from 'react';
import { useOverlayTriggerState } from 'react-stately';
import { VisualMediaModalType } from '@/types/definitions';
import { AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/Modal';
import { VisualMediaDialog } from '@/components/VisualMediaDialog';
import VisualMediaSlider from '@/components/VisualMediaSlider';

const VisualMediaModalContextApi = createContext<{
  show: () => void;
  setModal: Dispatch<SetStateAction<VisualMediaModalType>>;
}>({
  show: () => {},
  setModal: () => {},
});

function VisualMediaModalContextProvider({ children }: { children: React.ReactNode }) {
  const state = useOverlayTriggerState({});
  const [modal, setModal] = useState<VisualMediaModalType>({
    visualMedia: [],
    initialSlide: 0,
  });

  // Memoize to prevent unnecessary re-rendering of API consumers when `state` changes
  const memoizedContextApiValue = useMemo(
    () => ({
      show: state.open,
      setModal,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Don't add `state.open` here, otherwise our memoization technique won't work
  );

  return (
    <VisualMediaModalContextApi.Provider value={memoizedContextApiValue}>
      {children}
      <AnimatePresence>
        {state.isOpen && (
          <Modal state={state}>
            <VisualMediaDialog>
              <VisualMediaSlider {...modal} onClose={state.close} />
            </VisualMediaDialog>
          </Modal>
        )}
      </AnimatePresence>
    </VisualMediaModalContextApi.Provider>
  );
}

export { VisualMediaModalContextApi, VisualMediaModalContextProvider };
