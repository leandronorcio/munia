import { UserAboutSchema } from '@/lib/validations/userAbout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { GetUser } from '@/types/definitions';
import { useToast } from '../useToast';

/**
 * This hook is only used by the profile's profile/cover photo
 * and the profile's About page.
 */
export function useSessionUserDataMutation() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const qc = useQueryClient();
  const { showToast } = useToast();

  const updateSessionUserDataMutation = useMutation({
    mutationFn: async ({ data }: { data: UserAboutSchema }) => {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data }),
      });

      const response = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(response));

      return response as GetUser;
    },
    onSuccess: (updatedField) => {
      qc.setQueryData<GetUser>(['users', userId], (oldUserData) => {
        if (!oldUserData) return oldUserData;
        return {
          ...oldUserData,
          ...updatedField,
        };
      });
      showToast({
        type: 'success',
        title: 'Success',
        message: 'Your profile information has been updated.',
      });
    },
  });

  const updateSessionUserPhotosMutation = useMutation({
    mutationFn: async ({ toUpdate, formData }: { toUpdate: 'profile' | 'cover'; formData: FormData }) => {
      const res = await fetch(`/api/users/${userId}/${toUpdate === 'profile' ? 'profile-photo' : 'cover-photo'}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Error updating ${toUpdate} photo.`);
      }

      const { uploadedTo } = (await res.json()) as { uploadedTo: string };
      return {
        type: `${toUpdate}Photo`,
        uploadedTo,
      };
    },
    onSuccess: ({ type, uploadedTo }) => {
      qc.setQueryData<GetUser>(['users', userId], (oldUserData) => {
        if (!oldUserData) return oldUserData;
        return {
          ...oldUserData,
          [type]: uploadedTo,
        };
      });
    },
  });

  return { updateSessionUserDataMutation, updateSessionUserPhotosMutation };
}
