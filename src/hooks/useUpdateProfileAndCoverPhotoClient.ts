'use client';

import { ToastContext } from '@/contexts/ToastContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useContext, useRef } from 'react';
import { useBasicDialogs } from './useBasicDialogs';

export function useUpdateProfileAndCoverPhotoClient(
  toUpdate: 'profile' | 'cover'
) {
  const router = useRouter();

  const { alert } = useBasicDialogs();
  const { toastify } = useContext(ToastContext);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const user = session?.user;

  const openInput = () => {
    if (inputFileRef.current == null) return;
    inputFileRef.current.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const formData = new FormData();

    if (files === null) return;
    const file = files[0];

    formData.append(name, file, file.name);

    const res = await fetch(
      `/api/users/${user?.id}/${
        toUpdate === 'profile' ? 'profile-photo' : 'cover-photo'
      }`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (res.ok) {
      // const response: Response & { uploadedTo: string } = await res.json();
      toastify({
        title: 'Success!',
        message: `Your ${toUpdate} photo has been updated.`,
        type: 'success',
      });
      router.refresh();
    } else {
      alert({
        title: 'Upload Error',
        message: 'There was an error uploading your photo.',
      });
    }

    if (inputFileRef.current === null) return;
    inputFileRef.current.value = '';
  };

  return { inputFileRef, openInput, handleChange };
}
