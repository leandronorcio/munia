'use client';

import { useSession } from 'next-auth/react';
import { useRef } from 'react';
import { useBasicDialogs } from './useBasicDialogs';
import { useToast } from './useToast';
import { useUserDataMutation } from './mutations/useUserDataMutation';

export function useUpdateProfileAndCoverPhotoClient(
  toUpdate: 'profile' | 'cover'
) {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { updateUserPhotosMutation } = useUserDataMutation();
  const { alert } = useBasicDialogs();
  const { showToast } = useToast();
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

    if (!userId) return;
    updateUserPhotosMutation.mutate(
      {
        toUpdate,
        formData,
      },
      {
        onSuccess: () => {
          showToast({
            title: 'Success!',
            message: `Your ${toUpdate} photo has been updated.`,
            type: 'success',
          });
        },
        onError: () => {
          alert({
            title: 'Upload Error',
            message: 'There was an error uploading your photo.',
          });
        },
      }
    );

    if (inputFileRef.current === null) return;
    inputFileRef.current.value = '';
  };

  return { inputFileRef, openInput, handleChange };
}
