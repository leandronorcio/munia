import { UserSummaryAfterSetUp } from '@/types/definitions';

export async function getUsers({ searchKeyword }: { searchKeyword: string }) {
  const res = await fetch(`/api/users-basic?search=${searchKeyword}`);

  if (!res.ok) throw new Error('Error fetching users to mention.');
  return (await res.json()) as UserSummaryAfterSetUp[];
}
