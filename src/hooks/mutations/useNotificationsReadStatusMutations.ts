import { ACTIVITIES_PER_PAGE } from '@/constants';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { chunk } from 'lodash';
import { useSession } from 'next-auth/react';
import { GetActivity } from '@/types/definitions';

export function useNotificationsReadStatusMutations() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const queryKey = ['users', userId, 'notifications'];

  const markAsReadMutation = useMutation({
    mutationFn: async ({ notificationId }: { notificationId: number }) => {
      const res = await fetch(`/api/users/${session?.user.id}/notifications/${notificationId}`, {
        method: 'PATCH',
      });

      if (!res.ok) {
        throw new Error('Error marking the notification as read.');
      }

      return true;
    },
    onMutate: async ({ notificationId }) => {
      // Cancel outgoing queries and snapshot the prev value
      await qc.cancelQueries({ queryKey });
      const previousNotifications = qc.getQueryData(queryKey);

      // Optimistcally update the read status of the notification
      qc.setQueryData<InfiniteData<GetActivity[]>>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        // Flatten the old pages first
        const oldNotifications = oldData.pages.flat();

        // Find the index of the notification to update
        const index = oldNotifications.findIndex((oldNotification) => oldNotification.id === notificationId);

        // Save the value of the old notification
        const oldNotification = oldNotifications[index];

        // Update the notification read status using the `index`
        oldNotifications[index] = {
          ...oldNotification,
          isNotificationRead: true,
        };

        return {
          pages: chunk(oldNotifications, ACTIVITIES_PER_PAGE),
          pageParams: oldData.pageParams,
        };
      });

      // Return a context object with the snapshotted value
      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      qc.setQueryData(queryKey, context?.previousNotifications);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/users/${session?.user.id}/notifications`, {
        method: 'PATCH',
      });

      if (!res.ok) {
        throw new Error('Error marking the notification as read.');
      }

      return true;
    },
    onMutate: async () => {
      // Cancel outgoing queries and snapshot the prev value
      await qc.cancelQueries({ queryKey });
      const previousNotifications = qc.getQueryData(queryKey);

      // Optimistcally update the read status of the notification
      qc.setQueryData<InfiniteData<GetActivity[]>>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        // Flatten the old pages, then set each notification's `isNotificationRead` property to `true`
        const newNotifications = oldData.pages.flat().map((oldNotification) => ({
          ...oldNotification,
          isNotificationRead: true,
        }));

        return {
          pages: chunk(newNotifications, ACTIVITIES_PER_PAGE),
          pageParams: oldData.pageParams,
        };
      });

      // Return a context object with the snapshotted value
      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      qc.setQueryData(queryKey, context?.previousNotifications);
    },
  });

  return { markAsReadMutation, markAllAsReadMutation };
}
