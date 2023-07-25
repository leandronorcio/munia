import { User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { GetUser } from 'types';

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
    method: 'PUT',
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

export function useUserDataMutation() {
  const { data: session } = useSession();
  const qc = useQueryClient();

  const updateUserDataMutation = useMutation({
    mutationFn: updateUserData,
    onSuccess: (updatedField) => {
      qc.setQueryData<GetUser>(
        ['session-user-data', session?.user.id],
        (oldUserData) => {
          if (!oldUserData) return;
          return {
            ...oldUserData,
            ...updatedField,
          };
        }
      );
    },
  });

  return { updateUserDataMutation };
}
