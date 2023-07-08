import {
  CreatePostCallback,
  CreatePostModalContextApi,
} from '@/contexts/CreatePostModalContext';
import { useContext } from 'react';
import { VisualMedia } from 'types';

export function useCreatePost() {
  const {
    setShown,
    setCallbackFn,
    setShouldOpenFileInputOnMount,
    setToEditValues,
  } = useContext(CreatePostModalContextApi);

  const launchCreatePost = ({
    onSuccess,
    shouldOpenFileInputOnMount = false,
  }: {
    onSuccess: CreatePostCallback;
    shouldOpenFileInputOnMount?: boolean;
  }) => {
    setCallbackFn({ onSuccess });
    setShouldOpenFileInputOnMount(shouldOpenFileInputOnMount);
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
