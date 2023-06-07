'use client';
import Button from '@/components/Button';
import { ActionsPlus, Mail } from '@/svg_components';

export function ProfileActionButtons() {
  return (
    <div className="absolute -bottom-14 right-0 flex flex-row gap-4">
      <Button Icon={Mail} onClick={() => {}} size="small" mode="secondary" />
      <Button Icon={ActionsPlus} onClick={() => {}} size="small">
        Follow
      </Button>
    </div>
  );
}
