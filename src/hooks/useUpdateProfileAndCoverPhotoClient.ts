'use client';

import { useSession } from 'next-auth/react';
import React, { useRef } from 'react';
import { useDialogs } from './useDialogs';
import { useToast } from './useToast';
import { useSessionUserDataMutation } from './mutations/useSessionUserDataMutation';

export function useUpdateProfileAndCoverPhotoClient(toUpdate: 'profile' | 'cover') {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { updateSessionUserPhotosMutation } = useSessionUserDataMutation();
  const { alert } = useDialogs();
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
    updateSessionUserPhotosMutation.mutate(
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
      },
    );

    if (inputFileRef.current === null) return;
    inputFileRef.current.value = '';
  };

  return {
    inputFileRef,
    openInput,
    handleChange,
    isPending: updateSessionUserPhotosMutation.isPending,
  };
}
