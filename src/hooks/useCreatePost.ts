import { CreatePostModalContextApi } from '@/contexts/CreatePostModalContext';
import { useContext } from 'react';
import { VisualMedia } from 'types';

export function useCreatePost() {
  const { setShown, setShouldOpenFileInputOnMount, setToEditValues } =
    useContext(CreatePostModalContextApi);

  const launchCreatePost = ({
    shouldOpenFileInputOnMount = false,
  }: {
    shouldOpenFileInputOnMount?: boolean;
  }) => {
    setShouldOpenFileInputOnMount(shouldOpenFileInputOnMount);
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
    setShouldOpenFileInputOnMount(false);
    setToEditValues(null);
  };

  return { launchCreatePost, launchEditPost, exitCreatePostModal };
}
