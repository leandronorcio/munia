'use client';
import { CreatePostModal } from '@/components/CreatePostModal';
import { VisualMedia } from 'types';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from 'react';

export interface ToEditValues {
  postId: number;
  initialContent: string;
  initialVisualMedia: VisualMedia[];
}

const CreatePostModalContextData = createContext<{
  shown: boolean;
  toEditValues: ToEditValues | null;
  shouldOpenFileInputOnMount: boolean;
}>({
  shown: false,
  toEditValues: null,
  shouldOpenFileInputOnMount: false,
});

const CreatePostModalContextApi = createContext<{
  setShown: Dispatch<SetStateAction<boolean>>;
  setToEditValues: Dispatch<SetStateAction<ToEditValues | null>>;
  setShouldOpenFileInputOnMount: Dispatch<SetStateAction<boolean>>;
}>({
  setShown: () => {},
  setToEditValues: () => {},
  setShouldOpenFileInputOnMount: () => {},
});

function CreatePostModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const [toEditValues, setToEditValues] = useState<ToEditValues | null>(null);
  const [shouldOpenFileInputOnMount, setShouldOpenFileInputOnMount] =
    useState(false);

  const memoizedContextApiValue = useMemo(
    () => ({
      setShown,
      setToEditValues,
      setShouldOpenFileInputOnMount,
    }),
    [],
  );
  return (
    <CreatePostModalContextData.Provider
      value={{ shown, shouldOpenFileInputOnMount, toEditValues }}
    >
      <CreatePostModalContextApi.Provider value={memoizedContextApiValue}>
        <CreatePostModal />
        {children}
      </CreatePostModalContextApi.Provider>
    </CreatePostModalContextData.Provider>
  );
}

export {
  CreatePostModalContextData,
  CreatePostModalContextApi,
  CreatePostModalContextProvider,
};
