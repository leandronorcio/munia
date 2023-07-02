import { AnimatePresence } from 'framer-motion';
import ModalWrapper from './ModalWrapper';
import { ResponsiveContainer } from './ui/ResponsiveContainer';
import CreatePost from './CreatePost';
import { useContext } from 'react';
import {
  CreatePostModalContextApi,
  CreatePostModalContextData,
} from '@/contexts/CreatePostModalContext';

export function CreatePostModal() {
  const { shown, callbackFn, shouldOpenFileInputOnMount, toEditValues } =
    useContext(CreatePostModalContextData);
  const { setShown, setToEditValues } = useContext(CreatePostModalContextApi);
  const exitCreatePostModal = () => {
    setShown(false);
    setToEditValues(null);
  };

  return (
    <AnimatePresence>
      {shown && (
        <ModalWrapper key="create-post-modal-wrapper" zIndex={10}>
          <div className="w-full h-full grid place-items-center py-8 overflow-y-auto">
            <ResponsiveContainer>
              <CreatePost
                exitCreatePostModal={exitCreatePostModal}
                toEditValues={toEditValues}
                onSuccess={callbackFn.onSuccess}
                shouldOpenFileInputOnMount={shouldOpenFileInputOnMount}
              />
            </ResponsiveContainer>
          </div>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
}
