'use client';
import { CreatePostModal } from '@/components/CreatePostModal';
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
  toEditValues: ToEditValues | null;
}>({
  shown: false,
  callbackFn: {
    onSuccess: null,
  },
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
}>({
  setShown: () => {},
  setCallbackFn: () => {},
  setToEditValues: () => {},
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
  const [toEditValues, setToEditValues] = useState<ToEditValues | null>(null);

  const memoizedContextApiValue = useMemo(
    () => ({ setShown, setCallbackFn, setToEditValues }),
    []
  );
  return (
    <CreatePostModalContextData.Provider
      value={{ shown, callbackFn, toEditValues }}
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
