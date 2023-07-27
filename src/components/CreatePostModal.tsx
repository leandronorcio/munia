import { AnimatePresence } from 'framer-motion';
import ModalWrapper from './ModalWrapper';
import { ResponsiveContainer } from './ui/ResponsiveContainer';
import CreatePost from './CreatePost';
import { useContext } from 'react';
import { CreatePostModalContextData } from '@/contexts/CreatePostModalContext';

export function CreatePostModal() {
  const { shown, shouldOpenFileInputOnMount, toEditValues } = useContext(
    CreatePostModalContextData,
  );

  return (
    <AnimatePresence>
      {shown && (
        <ModalWrapper key="create-post-modal-wrapper" zIndex={10}>
          <div className="grid h-full w-full place-items-center overflow-y-auto py-8">
            <ResponsiveContainer>
              <CreatePost
                toEditValues={toEditValues}
                shouldOpenFileInputOnMount={shouldOpenFileInputOnMount}
              />
            </ResponsiveContainer>
          </div>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
}
