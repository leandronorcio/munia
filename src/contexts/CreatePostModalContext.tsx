'use client';
import { CreatePostModal } from '@/components/CreatePostModal';
import { PostType, VisualMedia } from 'types';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from 'react';
export type CreatePostCallback = (post: PostType) => void;
export interface ToEditValues {
  postId: number;
  initialContent: string;
  initialVisualMedia: VisualMedia[];
}

const CreatePostModalContextData = createContext<{
  shown: boolean;
  callbackFn: {
    onSuccess: CreatePostCallback | null;
  };
  shouldOpenFileInputOnMount: boolean;
  toEditValues: ToEditValues | null;
}>({
  shown: false,
  callbackFn: {
    onSuccess: null,
  },
  shouldOpenFileInputOnMount: false,
  toEditValues: null,
});
const CreatePostModalContextApi = createContext<{
  setShown: Dispatch<SetStateAction<boolean>>;
  setCallbackFn: Dispatch<
    SetStateAction<{
      onSuccess: CreatePostCallback | null;
    }>
  >;
  setToEditValues: Dispatch<SetStateAction<ToEditValues | null>>;
  setShouldOpenFileInputOnMount: Dispatch<SetStateAction<boolean>>;
}>({
  setShown: () => {},
  setCallbackFn: () => {},
  setToEditValues: () => {},
  setShouldOpenFileInputOnMount: () => {},
});

function CreatePostModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const [callbackFn, setCallbackFn] = useState<{
    onSuccess: CreatePostCallback | null;
  }>({
    onSuccess: null,
  });
  const [shouldOpenFileInputOnMount, setShouldOpenFileInputOnMount] =
    useState(false);
  const [toEditValues, setToEditValues] = useState<ToEditValues | null>(null);

  const memoizedContextApiValue = useMemo(
    () => ({
      setShown,
      setCallbackFn,
      setToEditValues,
      setShouldOpenFileInputOnMount,
    }),
    []
  );
  return (
    <CreatePostModalContextData.Provider
      value={{ shown, callbackFn, shouldOpenFileInputOnMount, toEditValues }}
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
