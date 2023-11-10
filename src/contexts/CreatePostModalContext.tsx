'use client';
import { GetVisualMedia } from '@/types/definitions';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from 'react';
import { useOverlayTriggerState } from 'react-stately';
import { AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/Modal';
import { CreatePostDialog } from '@/components/CreatePostDialog';

export interface ToEditValues {
  postId: number;
  initialContent: string;
  initialVisualMedia: GetVisualMedia[];
}

// Separate the `data` and `api` part of the context to prevent
// re-rendering of the `api` consumers when the `data` changes
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

  // Memoize to prevent re-rendering of consumers when the states change
  const memoizedContextApiValue = useMemo(
    () => ({
      setShown: state.setOpen,
      setToEditValues,
      setShouldOpenFileInputOnMount,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Don't add `state.setOpen` here, otherwise our memoization technique won't work
  );

  return (
    <CreatePostModalContextData.Provider
      value={{ shouldOpenFileInputOnMount, toEditValues }}
    >
      <CreatePostModalContextApi.Provider value={memoizedContextApiValue}>
        {children}
        <AnimatePresence>
          {state.isOpen && (
            // Set `isKeyboardDismissDisabled`, clicking the `Escape` key must be handled by <CreatePostDialog> instead.
            <Modal state={state} isKeyboardDismissDisabled>
              <CreatePostDialog />
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
