import { useCreatePostModalContextApi } from '@/contexts/CreatePostModalContext';
import { GetVisualMedia } from '@/types/definitions';

export function useCreatePostModal() {
  const { setShown, setShouldOpenFileInputOnMount, setToEditValues } = useCreatePostModalContextApi();

  const launchCreatePost = ({ shouldOpenFileInputOnMount = false }: { shouldOpenFileInputOnMount?: boolean }) => {
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
