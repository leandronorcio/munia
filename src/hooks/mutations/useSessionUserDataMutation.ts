import { User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { GetUser } from 'types';

/**
 * This hook is only used by the profile's profile/cover photo
 * and the profile's About page.
 */
export function useSessionUserDataMutation() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const qc = useQueryClient();

  const updateSessionUserDataMutation = useMutation({
    mutationFn: ({
      field,
      value,
    }: {
      field: keyof User;
      value: string | null;
    }) => updateUserData({ userId: userId!, field, value }),
    onSuccess: (updatedField) => {
      qc.setQueryData<GetUser>(['users', userId], (oldUserData) => {
        if (!oldUserData) return;
        return {
          ...oldUserData,
          ...updatedField,
        };
      });
    },
  });

  const updateSessionUserPhotosMutation = useMutation({
    mutationFn: ({
      toUpdate,
      formData,
    }: {
      toUpdate: 'profile' | 'cover';
      formData: FormData;
    }) => updateUserPhotos({ userId: userId!, toUpdate, formData }),
    onSuccess: ({ type, uploadedTo }) => {
      qc.setQueryData<GetUser>(['users', userId], (oldUserData) => {
        if (!oldUserData) return;
        return {
          ...oldUserData,
          [type]: uploadedTo,
        };
      });
    },
  });

  return { updateSessionUserDataMutation, updateSessionUserPhotosMutation };
}

const updateUserData = async ({
  userId,
  field,
  value,
}: {
  userId: string;
  field: keyof User;
  value: string | null;
}) => {
  const res = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ [field]: value }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error);
  }

  return { [field]: value };
};

const updateUserPhotos = async ({
  userId,
  toUpdate,
  formData,
}: {
  userId: string;
  toUpdate: 'profile' | 'cover';
  formData: FormData;
}) => {
  const res = await fetch(
    `/api/users/${userId}/${
      toUpdate === 'profile' ? 'profile-photo' : 'cover-photo'
    }`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error(`Error updating ${toUpdate} photo.`);
  }

  const { uploadedTo } = (await res.json()) as { uploadedTo: string };
  return {
    type: toUpdate + 'Photo',
    uploadedTo,
  };
};
