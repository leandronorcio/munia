'use client';
import Button from '@/components/ui/Button';
import { ActionsPlus, Mail } from '@/svg_components';

export function ProfileActionButtons() {
  return (
    <div className="absolute -bottom-14 right-4 flex flex-row gap-2 sm:gap-4">
      <Button Icon={Mail} onClick={() => {}} size="small" mode="secondary" />
      <Button Icon={ActionsPlus} onClick={() => {}} size="small">
        Follow
      </Button>
    </div>
  );
}
