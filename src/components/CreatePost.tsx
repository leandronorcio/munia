'use client';
import Button from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { CreatePostOptions } from './CreatePostOptions';
import { useEffect, useRef, useState } from 'react';
import { CreatePostTabs } from './CreatePostTabs';
import { useSession } from 'next-auth/react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { CloseButton } from './ui/CloseButton';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLettet';
import { ToEditValues } from '@/contexts/CreatePostModalContext';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { useToast } from '@/hooks/useToast';
import { GetPost, VisualMedia } from 'types';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { chunk } from 'lodash';
import { postsPerPage } from '@/contants';

export default function CreatePost({
  toEditValues,
  exitCreatePostModal,
  shouldOpenFileInputOnMount,
}: {
  toEditValues: ToEditValues | null;
  exitCreatePostModal: () => void;
  shouldOpenFileInputOnMount: boolean;
}) {
  const qc = useQueryClient();
  const mode: 'create' | 'edit' = toEditValues === null ? 'create' : 'edit';
  const [content, setContent] = useState(toEditValues?.initialContent || '');
  const [visualMedia, setVisualMedia] = useState<VisualMedia[]>(
    toEditValues?.initialVisualMedia || []
  );
  const { showToast } = useToast();
  const { confirm } = useBasicDialogs();
  const { data: session } = useSession();
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

  const generateFormData = async (): Promise<FormData> => {
    const formData = new FormData();
    formData.append('content', content);

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
     * The difference between set() and append() is that if the specified key already exists, set() will overwrite all existing values with the new one, whereas append() will append the new value onto the end of the existing set of values.
     */
    for (const item of visualMedia) {
      const file = await fetch(item.url).then((r) => r.blob());
      formData.append('files', file, file.name);
    }

    return formData;
  };

  const createPostMutation = useMutation(
    async () => {
      const res = await fetch(`/api/posts`, {
        method: 'POST',
        body: await generateFormData(),
      });

      if (!res) {
        throw Error('Error creating post.');
      }

      // Return the created post to be used by callbacks.
      return (await res.json()) as GetPost;
    },
    {
      onSuccess: (createdPost) => {
        qc.setQueryData<InfiniteData<GetPost[]>>(
          ['users', session?.user?.id, 'profile', 'posts'],
          (oldData) => {
            if (!oldData) return;

            // Flatten the old pages first then prepend the newly created post
            const newPosts = [createdPost, ...oldData?.pages.flat()];

            // Chunk the `newPosts` depending on the number of posts per page
            const newPages = chunk(newPosts, postsPerPage);

            const newPageParams = [
              // The first `pageParam` is undefined as the initial page does not use a `pageParam`
              undefined,
              // Create the new `pageParams`, it must contain the id of each page's (except last page's) last post
              ...newPages.slice(0, -1).map((page) => page.at(-1)?.id),
            ];

            return {
              pages: newPages,
              pageParams: newPageParams,
            };
          }
        );
        showToast({ title: 'Successfully Posted', type: 'success' });
        exitCreatePostModal();
      },
      onError: () => {
        showToast({ title: 'Error Creating Post', type: 'error' });
      },
    }
  );

  const updatePostMutation = useMutation(
    async () => {
      const res = await fetch(`/api/posts/${toEditValues?.postId}`, {
        method: 'PATCH',
        body: await generateFormData(),
      });

      if (!res) {
        throw Error('Failed to edit post.');
      }

      // Return the created post to be used by callbacks.
      return (await res.json()) as GetPost;
    },
    {
      onSuccess: (updatedPost) => {
        qc.setQueryData<InfiniteData<GetPost[]>>(
          ['users', session?.user?.id, 'profile', 'posts'],
          (oldData) => {
            if (!oldData) return;

            // Flatten the old pages first
            const oldPosts = oldData?.pages.flat();

            // Find the index of the updated post
            const index = oldPosts?.findIndex(
              (post) => post.id === updatedPost.id
            );

            // Write the updated post
            oldPosts[index] = updatedPost;

            return {
              pages: chunk(oldPosts, postsPerPage),
              pageParams: oldData.pageParams,
            };
          }
        );
        showToast({ title: 'Successfully Edited', type: 'success' });
        exitCreatePostModal();
      },
      onError: () => {
        showToast({ title: 'Error Editing Post', type: 'error' });
      },
    }
  );

  const handleClickPostButton = () => {
    setTimeout(() => {
      if (mode === 'create') {
        createPostMutation.mutate();
      } else {
        updatePostMutation.mutate();
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
