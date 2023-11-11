export async function getNotificationsCount({ userId }: { userId: string }) {
  const res = await fetch(`/api/users/${userId}/notifications/count`);

  if (!res.ok) throw new Error('Error fetching notifications count.');
  return (await res.json()) as number;
}
