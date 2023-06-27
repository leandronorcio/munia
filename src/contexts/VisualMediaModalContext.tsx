'use client';
import VisualMediaModal from '@/components/VisualMediaModal';
import { AnimatePresence } from 'framer-motion';
import { createContext, useState } from 'react';

const VisualMediaModalContext = createContext<{
  showVisualMediaModal: ({
    visualMedia,
    initialSlide,
  }: {
    visualMedia: VisualMedia[];
    initialSlide: number;
  }) => void;
}>({
  showVisualMediaModal: () => {},
});

function VisualMediaModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modal, setModal] = useState<{
    visualMedia: VisualMedia[];
    initialSlide: number;
    shown: boolean;
  }>({
    visualMedia: [],
    initialSlide: 0,
    shown: false,
  });

  const showVisualMediaModal = ({
    visualMedia,
    initialSlide,
  }: {
    visualMedia: VisualMedia[];
    initialSlide: number;
  }) => {
    setModal({
      visualMedia,
      initialSlide,
      shown: true,
    });
  };

  const hideVisualMediaModal = () => {
    setModal((prev) => ({
      ...prev,
      shown: false,
    }));
  };

  return (
    <VisualMediaModalContext.Provider value={{ showVisualMediaModal }}>
      <AnimatePresence>
        {modal.shown && (
          <VisualMediaModal
            key="visual-media-modal"
            visualMedia={modal.visualMedia}
            initialSlide={modal.initialSlide}
            close={hideVisualMediaModal}
          />
        )}
      </AnimatePresence>
      {children}
    </VisualMediaModalContext.Provider>
  );
}

export { VisualMediaModalContext, VisualMediaModalContextProvider };
