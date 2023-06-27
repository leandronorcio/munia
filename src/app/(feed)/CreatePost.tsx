'use client';
import Button from '@/components/ui/Button';
import ProfilePhoto from '@/components/ui/ProfilePhoto';
import TextArea from '@/components/ui/TextArea';
import CreatePostOptions from './CreatePostOptions';
import { useContext, useState } from 'react';
import { ToastContext } from '@/contexts/ToastContext';
import { CreatePostTabs } from './CreatePostTabs';
import { useSession } from 'next-auth/react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [visualMedia, setVisualMedia] = useState<VisualMedia[]>([]);
  const { toastify } = useContext(ToastContext);
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

  const submitPost = async () => {
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

    const res = await fetch(`/api/users/${user?.id}/posts`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setContent('');
      setVisualMedia([]);
      toastify({ title: 'Successfully Posted', type: 'success' });
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-slate-50 mb-6 ">
      <div className="flex flex-row mb-[18px] ">
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
            onClick={submitPost}
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
