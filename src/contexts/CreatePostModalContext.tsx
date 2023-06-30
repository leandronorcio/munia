'use client';
import CreatePost from '@/components/CreatePost';
import ModalWrapper from '@/components/ModalWrapper';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { AnimatePresence } from 'framer-motion';
import { createContext, useState } from 'react';

const CreatePostModalContext = createContext<{
  launchCreatePost: () => void;
  launchEditPost: ({
    initialContent,
    initialVisualMedia,
    postId,
  }: {
    initialContent: string;
    initialVisualMedia: VisualMedia[];
    postId: number;
  }) => void;
}>({ launchCreatePost: () => {}, launchEditPost: () => {} });

function CreatePostModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const [toEditValues, setToEditValues] = useState<{
    postId: number;
    initialContent: string;
    initialVisualMedia: VisualMedia[];
  } | null>(null);

  const launchCreatePost = () => {
    setShown(true);
  };

  const launchEditPost = ({
    initialContent,
    initialVisualMedia,
    postId,
  }: {
    initialContent: string;
    initialVisualMedia: VisualMedia[];
    postId: number;
  }) => {
    setToEditValues({
      postId,
      initialContent,
      initialVisualMedia,
    });
    setShown(true);
  };

  const exitCreatePostModal = () => {
    setShown(false);
    setToEditValues(null);
  };

  return (
    <CreatePostModalContext.Provider
      value={{ launchCreatePost, launchEditPost }}
    >
      <AnimatePresence>
        {shown && (
          <ModalWrapper key="create-post-modal-wrapper" zIndex={10}>
            <div className="w-full h-full grid place-items-center py-8 overflow-y-auto">
              <ResponsiveContainer>
                <CreatePost
                  exitCreatePostModal={exitCreatePostModal}
                  toEditValues={toEditValues}
                />
              </ResponsiveContainer>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>
      {children}
    </CreatePostModalContext.Provider>
  );
}

export { CreatePostModalContext, CreatePostModalContextProvider };
