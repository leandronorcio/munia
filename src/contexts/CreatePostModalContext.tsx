'use client';
import CreatePost from '@/components/CreatePost';
import ModalWrapper from '@/components/ModalWrapper';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { AnimatePresence } from 'framer-motion';
import { createContext, useEffect, useState } from 'react';
export type CreatePostCallback = (post: PostType) => void;

const CreatePostModalContext = createContext<{
  launchCreatePost: ({ onSuccess }: { onSuccess: CreatePostCallback }) => void;
  launchEditPost: ({
    initialContent,
    initialVisualMedia,
    postId,
  }: {
    initialContent: string;
    initialVisualMedia: VisualMedia[];
    postId: number;
    onSuccess: CreatePostCallback;
  }) => void;
}>({ launchCreatePost: () => {}, launchEditPost: () => {} });

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
  const [toEditValues, setToEditValues] = useState<{
    postId: number;
    initialContent: string;
    initialVisualMedia: VisualMedia[];
  } | null>(null);

  const launchCreatePost = ({
    onSuccess,
  }: {
    onSuccess: CreatePostCallback;
  }) => {
    setShown(true);
    setCallbackFn({ onSuccess });
  };

  const launchEditPost = ({
    initialContent,
    initialVisualMedia,
    postId,
    onSuccess,
  }: {
    initialContent: string;
    initialVisualMedia: VisualMedia[];
    postId: number;
    onSuccess: CreatePostCallback;
  }) => {
    setToEditValues({
      postId,
      initialContent,
      initialVisualMedia,
    });
    setShown(true);
    setCallbackFn({ onSuccess });
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
                  onSuccess={callbackFn.onSuccess}
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
