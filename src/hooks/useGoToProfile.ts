import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
/**
 * Always use this hook when navigating to a profile page,
 * this makes sure that the loaded profile page is freshly
 * loaded.
 * @returns - goToProfile
 */
export function useGoToProfile() {
  const qc = useQueryClient();
  const router = useRouter();

  function goToProfile({
    userId,
    username,
  }: {
    userId: string;
    username: string;
  }) {
    if (userId) {
      qc.removeQueries({ queryKey: ['users', userId, 'profile', 'posts'] });
    }
    router.push(`/${username}`);
  }

  return { goToProfile };
}
