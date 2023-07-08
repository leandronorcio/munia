'use client';
import VisualMediaModal from '@/components/VisualMediaModal';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from 'react';
import { VisualMedia } from 'types';

interface VisualMediaModalType {
  visualMedia: VisualMedia[];
  initialSlide: number;
}
const VisualMediaModalDefault = {
  visualMedia: [],
  initialSlide: 0,
};

const VisualMediaModalContextData = createContext<{
  shown: boolean;
  modal: VisualMediaModalType;
}>({
  shown: false,
  modal: VisualMediaModalDefault,
});
const VisualMediaModalContextApi = createContext<{
  setShown: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<VisualMediaModalType>>;
}>({
  setShown: () => {},
  setModal: () => {},
});

function VisualMediaModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const [modal, setModal] = useState<VisualMediaModalType>(
    VisualMediaModalDefault
  );
  const memoizedContextApiValue = useMemo(
    () => ({
      setShown,
      setModal,
    }),
    []
  );

  return (
    <VisualMediaModalContextData.Provider value={{ shown, modal }}>
      <VisualMediaModalContextApi.Provider value={memoizedContextApiValue}>
        <VisualMediaModal />
        {children}
      </VisualMediaModalContextApi.Provider>
    </VisualMediaModalContextData.Provider>
  );
}

export {
  VisualMediaModalContextData,
  VisualMediaModalContextApi,
  VisualMediaModalContextProvider,
};
