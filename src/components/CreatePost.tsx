'use client';
import Button from '@/components/ui/Button';
import ProfilePhoto from '@/components/ui/ProfilePhoto';
import TextArea from '@/components/ui/TextArea';
import CreatePostOptions from './CreatePostOptions';
import { useState } from 'react';
import { CreatePostTabs } from './CreatePostTabs';
import { useSession } from 'next-auth/react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { CloseButton } from './ui/CloseButton';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLettet';
import { CreatePostCallback } from '@/contexts/CreatePostModalContext';
import { useBasicDialogs } from '@/hooks/useBasicDialogs';
import { useToast } from '@/hooks/useToast';

export default function CreatePost({
  toEditValues,
  exitCreatePostModal,
  onSuccess,
}: {
  toEditValues: {
    postId: number;
    initialContent: string;
    initialVisualMedia: VisualMedia[];
  } | null;
  exitCreatePostModal: () => void;
  onSuccess: CreatePostCallback | null;
}) {
  const mode: 'create' | 'edit' = toEditValues === null ? 'create' : 'edit';
  const [content, setContent] = useState(toEditValues?.initialContent || '');
  const [visualMedia, setVisualMedia] = useState<VisualMedia[]>(
    toEditValues?.initialVisualMedia || []
  );
  const { showToast } = useToast();
  const { confirm } = useBasicDialogs();
  const { data: session } = useSession();
  const user = session?.user;

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

  const submitPost = async () => {
    const res = await fetch(`/api/users/${user?.id}/posts`, {
      method: 'POST',
      body: await generateFormData(),
    });

    if (res.ok) {
      const createdPost = await res.json();
      onSuccess !== null && onSuccess(createdPost);
      showToast({ title: 'Successfully Posted', type: 'success' });
      exitCreatePostModal();
    } else {
      showToast({ title: 'Error Creating Post', type: 'error' });
    }
  };

  const submitPostEdit = async () => {
    const res = await fetch(
      `/api/users/${user?.id}/posts/${toEditValues?.postId}`,
      {
        method: 'PUT',
        body: await generateFormData(),
      }
    );

    if (res.ok) {
      const editedPost = await res.json();
      onSuccess !== null && onSuccess(editedPost);
      showToast({ title: 'Successfully Edited', type: 'success' });
      exitCreatePostModal();
    } else {
      showToast({ title: 'Error Editing Post', type: 'error' });
    }
  };

  const handleClickPostButton = () => {
    if (mode === 'create') {
      submitPost();
    } else {
      submitPostEdit();
    }
  };

  const handleClickCloseButton = () => {
    if (content !== '' || visualMedia.length > 0) {
      confirm({
        title: 'Exit',
        message: "Do you really wish to exit? Changes won't be saved.",
        onConfirm: () => setTimeout(() => exitCreatePostModal(), 300),
      });
      return;
    }
    exitCreatePostModal();
  };

  return (
    <div className="pb-5 rounded-xl bg-white mb-6 ">
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
          <ProfilePhoto />
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
          />
        </div>
        <div>
          <Button
            mode="secondary"
            onClick={handleClickPostButton}
            size="small"
            disabled={content === '' && visualMedia.length === 0}
          >
            Post
          </Button>
        </div>
      </div>
      <CreatePostOptions handleVisualMediaChange={handleVisualMediaChange} />
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
