'use client';
import VisualMediaModal from '@/components/VisualMediaModal';
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
  const [shown, setShown] = useState(false);
  const [modal, setModal] = useState<{
    visualMedia: VisualMedia[];
    initialSlide: number;
  }>({
    visualMedia: [],
    initialSlide: 0,
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
    });
    setShown(true);
  };

  const hideVisualMediaModal = () => {
    setShown(false);
  };

  return (
    <VisualMediaModalContext.Provider value={{ showVisualMediaModal }}>
      <VisualMediaModal
        shown={shown}
        visualMedia={modal.visualMedia}
        initialSlide={modal.initialSlide}
        close={hideVisualMediaModal}
      />
      {children}
    </VisualMediaModalContext.Provider>
  );
}

export { VisualMediaModalContext, VisualMediaModalContextProvider };
