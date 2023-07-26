'use client';
import Button from '@/components/ui/Button';
import { useUserQuery } from '@/hooks/queries/useUserQuery';
import { useToast } from '@/hooks/useToast';
import { Mail } from '@/svg_components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { GetUser } from 'types';

export function ProfileActionButtons({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const { data: targetUser, isLoading } = useUserQuery(targetUserId);
  const isFollowing = targetUser?.isFollowing;
  const queryKey = ['users', targetUserId];

  const { showToast } = useToast();

  const followMutation = useMutation({
    mutationFn: follow,
    onMutate: async () => {
      // Cancel outgoing queries and snapshot the prev value
      await qc.cancelQueries({ queryKey });
      const previousTargetUser = qc.getQueryData(queryKey);

      // Optimistically update the UI
      qc.setQueryData<GetUser>(queryKey, (oldTargetUser) => {
        if (!oldTargetUser) return;
        return {
          ...oldTargetUser,
          isFollowing: true,
        };
      });

      // Return a context object with the snapshotted value
      return { previousTargetUser };
    },
    onError: (err: Error, variables, context) => {
      qc.setQueryData(queryKey, context?.previousTargetUser);
      showToast({ title: 'Something Went Wrong', message: err.message });
    },
  });

  const unFollowMutation = useMutation({
    mutationFn: unFollow,
    onMutate: async () => {
      // Cancel outgoing queries and snapshot the prev value
      await qc.cancelQueries({ queryKey });
      const previousTargetUser = qc.getQueryData(queryKey);

      // Optimistically update the UI
      qc.setQueryData<GetUser>(queryKey, (oldTargetUser) => {
        if (!oldTargetUser) return;
        return {
          ...oldTargetUser,
          isFollowing: false,
        };
      });

      // Return a context object with the snapshotted value
      return { previousTargetUser };
    },
    onError: (err: Error, variables, context) => {
      qc.setQueryData(queryKey, context?.previousTargetUser);
      showToast({ title: 'Something Went Wrong', message: err.message });
    },
  });

  const handleClick = () => {
    isFollowing
      ? unFollowMutation.mutate({ userId: session?.user.id!, targetUserId })
      : followMutation.mutate({ userId: session?.user.id!, targetUserId });
  };

  return (
    <div className="flex flex-row items-center gap-2 md:gap-4">
      <Button
        onClick={handleClick}
        mode={isFollowing ? 'subtle' : 'primary'}
        shape="pill"
        loading={isLoading}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
      <Button Icon={Mail} onClick={() => {}} mode="secondary" size="medium" />
    </div>
  );
}

const follow = async ({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) => {
  const res = await fetch(`/api/users/${userId}/following`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userIdToFollow: targetUserId }),
  });

  if (!res.ok) {
    if (res.status === 409) return;
    throw new Error('Failed to follow user.');
  }

  return true;
};

const unFollow = async ({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) => {
  const res = await fetch(`/api/users/${userId}/following/${targetUserId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    if (res.status === 409) return;
    throw new Error('Failed to unfollow user.');
  }

  return true;
};
