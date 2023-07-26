'use client';
import Button from '@/components/ui/Button';
import { useFollowsMutations } from '@/hooks/mutations/useFollowsMutations';
import { useUserQuery } from '@/hooks/queries/useUserQuery';
import { Mail } from '@/svg_components';

export function ProfileActionButtons({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const { data: targetUser, isLoading } = useUserQuery(targetUserId);
  const isFollowing = targetUser?.isFollowing;
  const { followMutation, unFollowMutation } = useFollowsMutations({
    targetUserId,
  });

  const handleClick = () => {
    isFollowing ? unFollowMutation.mutate() : followMutation.mutate();
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
