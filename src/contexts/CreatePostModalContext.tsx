'use client';
import { VisualMedia } from 'types';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useOverlayTriggerState } from 'react-stately';
import { AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/Modal';
import { CreatePostDialog } from '@/components/CreatePostDialog';

export interface ToEditValues {
  postId: number;
  initialContent: string;
  initialVisualMedia: VisualMedia[];
}

const CreatePostModalContextData = createContext<{
  toEditValues: ToEditValues | null;
  shouldOpenFileInputOnMount: boolean;
}>({
  toEditValues: null,
  shouldOpenFileInputOnMount: false,
});

const CreatePostModalContextApi = createContext<{
  setShown: (isOpen: boolean) => void;
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
  const state = useOverlayTriggerState({});
  const [toEditValues, setToEditValues] = useState<ToEditValues | null>(null);
  const [shouldOpenFileInputOnMount, setShouldOpenFileInputOnMount] =
    useState(false);

  const memoizedContextApiValue = useMemo(
    () => ({
      setShown: state.setOpen,
      setToEditValues,
      setShouldOpenFileInputOnMount,
    }),
    [],
  );

  return (
    <CreatePostModalContextData.Provider
      value={{ shouldOpenFileInputOnMount, toEditValues }}
    >
      <CreatePostModalContextApi.Provider value={memoizedContextApiValue}>
        {children}
        <AnimatePresence>
          {state.isOpen && (
            // Set `isKeyboardDismissDisabled`, clicking the `Escape` key must be handled by <CreatePost> instead.
            <Modal state={state} isKeyboardDismissDisabled>
              <CreatePostDialog onClose={state.close}></CreatePostDialog>
            </Modal>
          )}
        </AnimatePresence>
      </CreatePostModalContextApi.Provider>
    </CreatePostModalContextData.Provider>
  );
}

export {
  CreatePostModalContextData,
  CreatePostModalContextApi,
  CreatePostModalContextProvider,
};
