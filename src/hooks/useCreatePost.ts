import { CreatePostModalContextApi } from '@/contexts/CreatePostModalContext';
import { useContext } from 'react';
import { GetVisualMedia } from '@/types/definitions';

export function useCreatePost() {
  const { setShown, setShouldOpenFileInputOnMount, setToEditValues } =
    useContext(CreatePostModalContextApi);

  const launchCreatePost = ({
    shouldOpenFileInputOnMount = false,
  }: {
    shouldOpenFileInputOnMount?: boolean;
  }) => {
    setToEditValues(null);
    setShouldOpenFileInputOnMount(shouldOpenFileInputOnMount);
    setShown(true);
  };

  const launchEditPost = ({
    initialContent,
    initialVisualMedia,
    postId,
  }: {
    initialContent: string;
    initialVisualMedia: GetVisualMedia[];
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
  };

  return { launchCreatePost, launchEditPost, exitCreatePostModal };
}
