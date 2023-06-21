'use client';
import Button from '@/components/ui/Button';
import ProfilePhoto from '@/components/ui/ProfilePhoto';
import TextArea from '@/components/ui/TextArea';
import CreatePostOptions from './CreatePostOptions';
import { useContext, useState } from 'react';
import { ToastContext } from '@/contexts/ToastContext';
import { CreatePostTabs } from './CreatePostTabs';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [visualMediaFiles, setVisualMediaFiles] = useState<File[]>([]);
  const { toastify } = useContext(ToastContext);

  const handleVisualMediaChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    const { name, files } = e.target;

    if (files === null) return;
    const filesArr = [...files];
    setVisualMediaFiles((prev) => [...prev, ...filesArr]);
  };

  const submitPost = async () => {
    const formData = new FormData();
    formData.append('content', content);

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
     * The difference between set() and append() is that if the specified key already exists, set() will overwrite all existing values with the new one, whereas append() will append the new value onto the end of the existing set of values.
     */
    for (const visualMediaFile of visualMediaFiles) {
      formData.append('files', visualMediaFile, visualMediaFile.name);
    }

    const res = await fetch('/api/post', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
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
            disabled={content === '' && visualMediaFiles.length === 0}
          >
            Post
          </Button>
        </div>
      </div>
      <CreatePostOptions handleVisualMediaChange={handleVisualMediaChange} />
      <CreatePostTabs visualMediaFiles={visualMediaFiles} />
    </div>
  );
}
