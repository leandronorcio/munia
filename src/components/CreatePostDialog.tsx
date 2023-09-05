'use client';

import Button from '@/components/ui/Button';
import { CreatePostOptions } from './CreatePostOptions';
import { useContext, useEffect, useRef, useState } from 'react';
import { CreatePostTabs } from './CreatePostTabs';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { CreatePostModalContextData } from '@/contexts/CreatePostModalContext';
import { GetVisualMedia } from 'types';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import { useCreatePost } from '@/hooks/useCreatePost';
import { useCreateUpdatePostMutations } from '@/hooks/mutations/useCreateUpdatePostMutations';
import { TextAreaWithMentionsAndHashTags } from './TextAreaWithMentionsAndHashTags';
import { useDialogs } from '@/hooks/useDialogs';
import { GenericDialog } from './GenericDialog';
import { capitalize } from 'lodash';

export function CreatePostDialog() {
  const { toEditValues, shouldOpenFileInputOnMount } = useContext(
    CreatePostModalContextData,
  );
  const mode: 'create' | 'edit' = toEditValues === null ? 'create' : 'edit';
  const [content, setContent] = useState(toEditValues?.initialContent || '');
  const [visualMedia, setVisualMedia] = useState<GetVisualMedia[]>(
    toEditValues?.initialVisualMedia || [],
  );
  const { createPostMutation, updatePostMutation } =
    useCreateUpdatePostMutations({
      content,
      visualMedia,
    });
  const { exitCreatePostModal } = useCreatePost();
  const { confirm } = useDialogs();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleVisualMediaChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    const { name, files } = e.target;

    if (files === null) return;
    const filesArr = [...files];
    const newVisualMediaArr: GetVisualMedia[] = filesArr.map((file) => ({
      type: file.type.startsWith('image/') ? 'PHOTO' : 'VIDEO',
      url: URL.createObjectURL(file),
    }));

    setVisualMedia((prev) => [...prev, ...newVisualMediaArr]);
    e.target.value = '';
  };

  const handleClickPostButton = () => {
    if (mode === 'create') return createPostMutation.mutate();
    if (!toEditValues) return;
    updatePostMutation.mutate({ postId: toEditValues.postId });
  };

  const confirmExit = () => {
    confirm({
      title: 'Unsaved Changes',
      message: 'Do you really wish to exit?',
      onConfirm: () => setTimeout(() => exitCreatePostModal(), 300),
    });
  };

  const handleClose = () => {
    if (mode === 'create') {
      if (content !== '' || visualMedia.length > 0) {
        confirmExit();
        return;
      }
    } else if (mode === 'edit') {
      if (
        content !== toEditValues?.initialContent ||
        visualMedia !== toEditValues.initialVisualMedia
      ) {
        confirmExit();
        return;
      }
    }
    exitCreatePostModal();
  };

  useEffect(() => {
    if (inputFileRef.current === null) return;
    if (shouldOpenFileInputOnMount) inputFileRef.current.click();
  }, [inputFileRef.current]);

  useEffect(() => {
    if (textareaRef.current === null) return;
    textareaRef.current.focus();
  }, [textareaRef.current]);

  useEffect(() => {
    const escPressed = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', escPressed, false);
    return () => {
      document.removeEventListener('keydown', escPressed, false);
    };
  }, [handleClose]);

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
            mode="secondary"
            onPress={handleClickPostButton}
            size="small"
            isDisabled={content === '' && visualMedia.length === 0}
            loading={
              createPostMutation.isPending || updatePostMutation.isPending
            }
          >
            Post
          </Button>
        </div>
      </div>
      <CreatePostOptions
        handleVisualMediaChange={handleVisualMediaChange}
        ref={inputFileRef}
      />
      <AnimatePresence>
        {visualMedia.length > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <CreatePostTabs
              visualMedia={visualMedia}
              setVisualMedia={setVisualMedia}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </GenericDialog>
  );
}
