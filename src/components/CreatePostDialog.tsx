import Button from '@/components/ui/Button';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GetVisualMedia } from '@/types/definitions';
import { useWritePostMutations } from '@/hooks/mutations/useWritePostMutations';
import { useDialogs } from '@/hooks/useDialogs';
import { capitalize } from 'lodash';
import { revokeVisualMediaObjectUrls } from '@/lib/revokeVisualMediaObjectUrls';
import { ToEditValues } from '@/lib/createPost';
import { TextAreaWithMentionsAndHashTags } from './TextAreaWithMentionsAndHashTags';
import { GenericDialog } from './GenericDialog';
import { CreatePostSort } from './CreatePostSort';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import { CreatePostOptions } from './CreatePostOptions';

export function CreatePostDialog({
  toEditValues,
  shouldOpenFileInputOnMount,
  setShown,
}: {
  toEditValues: ToEditValues | null;
  shouldOpenFileInputOnMount: boolean;
  setShown: (isOpen: boolean) => void;
}) {
  const mode: 'create' | 'edit' = toEditValues === null ? 'create' : 'edit';
  const [content, setContent] = useState(toEditValues?.initialContent || '');
  const [visualMedia, setVisualMedia] = useState<GetVisualMedia[]>(toEditValues?.initialVisualMedia ?? []);
  const exitCreatePostModal = useCallback(() => setShown(false), [setShown]);
  const { createPostMutation, updatePostMutation } = useWritePostMutations({
    content,
    visualMedia,
    exitCreatePostModal,
  });
  const { confirm } = useDialogs();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleVisualMediaChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(async (e) => {
    const { files } = e.target;

    if (files === null) return;
    const filesArr = [...files];
    const selectedVisualMedia: GetVisualMedia[] = filesArr.map((file) => ({
      type: file.type.startsWith('image/') ? 'PHOTO' : 'VIDEO',
      url: URL.createObjectURL(file),
    }));
    setVisualMedia((prev) => [...prev, ...selectedVisualMedia]);
    // Clear the file input
    e.target.value = '';
  }, []);

  const handleClickPostButton = useCallback(() => {
    if (mode === 'create') {
      createPostMutation.mutate();
    } else {
      if (!toEditValues) return;
      updatePostMutation.mutate({ postId: toEditValues.postId });
    }
  }, [createPostMutation, mode, toEditValues, updatePostMutation]);

  const exit = useCallback(() => {
    exitCreatePostModal();
    // Revoke the object URL's when exiting the create post dialog
    revokeVisualMediaObjectUrls(visualMedia);
  }, [exitCreatePostModal, visualMedia]);

  const confirmExit = useCallback(() => {
    confirm({
      title: 'Unsaved Changes',
      message: 'Do you really wish to exit?',
      onConfirm: () => setTimeout(() => exit(), 300),
    });
  }, [confirm, exit]);

  const handleClose = useCallback(() => {
    if (mode === 'create') {
      if (content !== '' || visualMedia.length > 0) {
        confirmExit();
        return;
      }
    } else if (mode === 'edit') {
      if (content !== toEditValues?.initialContent || visualMedia !== toEditValues.initialVisualMedia) {
        confirmExit();
        return;
      }
    }
    exit();
  }, [confirmExit, content, visualMedia, mode, toEditValues, exit]);

  const sortVariants = useMemo(
    () => ({
      initial: { height: 0 },
      animate: { height: 'auto' },
      exit: { height: 0 },
    }),
    [],
  );

  useEffect(() => {
    if (inputFileRef.current === null) return;
    if (shouldOpenFileInputOnMount) inputFileRef.current.click();
  }, [shouldOpenFileInputOnMount]);

  useEffect(() => {
    if (textareaRef.current === null) return;
    textareaRef.current.focus();
  }, []);

  useEffect(() => {
    const onEscPressed = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', onEscPressed, false);
    return () => {
      document.removeEventListener('keydown', onEscPressed, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GenericDialog title={`${capitalize(mode)} Post`} handleClose={handleClose}>
      <div className="mb-[18px] flex flex-row gap-3 px-4">
        <div className="h-11 w-11">
          <ProfilePhotoOwn />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <TextAreaWithMentionsAndHashTags
            content={content}
            setContent={setContent}
            placeholder="What's on your mind?"
          />
        </div>
        <div>
          <Button
            onPress={handleClickPostButton}
            size="small"
            isDisabled={content === '' && visualMedia.length === 0}
            loading={createPostMutation.isPending || updatePostMutation.isPending}>
            Post
          </Button>
        </div>
      </div>
      <CreatePostOptions handleVisualMediaChange={handleVisualMediaChange} ref={inputFileRef} />
      <AnimatePresence>
        {visualMedia.length > 0 && (
          <motion.div
            variants={sortVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="overflow-hidden">
            <CreatePostSort visualMedia={visualMedia} setVisualMedia={setVisualMedia} />
          </motion.div>
        )}
      </AnimatePresence>
    </GenericDialog>
  );
}
