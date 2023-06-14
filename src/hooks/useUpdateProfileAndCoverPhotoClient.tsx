'use client';

import { BasicModalContext } from '@/contexts/BasicModalContext';
import { useContext, useRef, useState } from 'react';

export function useUpdateProfileAndCoverPhotoClient(
  toUpdate: 'profilePhoto' | 'coverPhoto',
  initialPhotoUrl: string | null
) {
  const [photoUrl, setPhotoUrl] = useState(
    initialPhotoUrl ||
      (toUpdate === 'profilePhoto' ? '/default-profile-photo.jpg' : '')
  );

  const { alert } = useContext(BasicModalContext);
  const inputFileRef = useRef<HTMLInputElement>(null);

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
      `/api/${toUpdate === 'profilePhoto' ? 'profile-photo' : 'cover-photo'}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (res.ok) {
      const response: Response & { uploadedTo: string } = await res.json();
      setPhotoUrl(response.uploadedTo);
    } else {
      alert({
        title: 'Upload Error',
        message: 'There was an error uploading your photo.',
      });
    }

    if (inputFileRef.current === null) return;
    inputFileRef.current.value = '';
  };

  return { inputFileRef, openInput, handleChange, photoUrl };
}
