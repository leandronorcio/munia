import {
  CreatePostCallback,
  CreatePostModalContextApi,
} from '@/contexts/CreatePostModalContext';
import { useContext } from 'react';

export function useCreatePost() {
  const { setShown, setCallbackFn, setToEditValues } = useContext(
    CreatePostModalContextApi
  );

  const launchCreatePost = ({
    onSuccess,
  }: {
    onSuccess: CreatePostCallback;
  }) => {
    setCallbackFn({ onSuccess });
    setShown(true);
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
    setCallbackFn({ onSuccess });
    setShown(true);
  };

  return { launchCreatePost, launchEditPost };
}
