'use client';
import Button from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { CreatePostOptions } from './CreatePostOptions';
import { useEffect, useRef, useState } from 'react';
import { CreatePostTabs } from './CreatePostTabs';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { CloseButton } from './ui/CloseButton';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLettet';
import { ToEditValues } from '@/contexts/CreatePostModalContext';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { VisualMedia } from 'types';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import { useCreatePost } from '@/hooks/useCreatePost';
import { useCreatePostMutations } from '@/hooks/useCreatePostMutations';

export default function CreatePost({
  toEditValues,
  shouldOpenFileInputOnMount,
}: {
  toEditValues: ToEditValues | null;
  shouldOpenFileInputOnMount: boolean;
}) {
  const mode: 'create' | 'edit' = toEditValues === null ? 'create' : 'edit';
  const [content, setContent] = useState(toEditValues?.initialContent || '');
  const [visualMedia, setVisualMedia] = useState<VisualMedia[]>(
    toEditValues?.initialVisualMedia || []
  );
  const { createPostMutation, updatePostMutation } = useCreatePostMutations({
    content,
    visualMedia,
  });
  const { exitCreatePostModal } = useCreatePost();
  const { confirm } = useBasicDialogs();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputFileRef.current === null) return;
    if (shouldOpenFileInputOnMount) inputFileRef.current.click();
  }, [inputFileRef.current]);

  useEffect(() => {
    if (textareaRef.current === null) return;
    textareaRef.current.focus();
  }, [textareaRef.current]);

  const handleVisualMediaChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    const { name, files } = e.target;

    if (files === null) return;
    const filesArr = [...files];
    const newVisualMediaArr: VisualMedia[] = filesArr.map((file) => ({
      type: file.type.startsWith('image/') ? 'PHOTO' : 'VIDEO',
      url: URL.createObjectURL(file),
    }));

    setVisualMedia((prev) => [...prev, ...newVisualMediaArr]);
    e.target.value = '';
  };

  const handleClickPostButton = () => {
    setTimeout(() => {
      if (mode === 'create') {
        createPostMutation.mutate();
      } else {
        updatePostMutation.mutate({ postId: toEditValues?.postId! });
      }
    }, 50);
  };

  const handleClickCloseButton = () => {
    const confirmExit = () => {
      confirm({
        title: 'Exit',
        message: "Do you really wish to exit? Changes won't be saved.",
        onConfirm: () => setTimeout(() => exitCreatePostModal(), 300),
      });
    };
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

  return (
    <div className="rounded-xl overflow-hidden bg-white mb-6">
      <div className="mb-4 py-3 bg-gray-100 rounded-t-xl relative">
        <h3 className="text-lg font-semibold text-center">
          {capitalizeFirstLetter(mode)} Post
        </h3>
        <CloseButton
          className="absolute top-[50%] translate-y-[-50%] right-3"
          onClick={handleClickCloseButton}
        />
      </div>
      <div className="flex flex-row mb-[18px] px-4">
        <div className="w-11 h-11">
          <ProfilePhotoOwn />
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            ref={textareaRef}
            placeholder="What's on your mind?"
          />
        </div>
        <div>
          <Button
            mode="secondary"
            onClick={handleClickPostButton}
            size="small"
            disabled={content === '' && visualMedia.length === 0}
            loading={
              createPostMutation.isLoading || updatePostMutation.isLoading
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
    </div>
  );
}
