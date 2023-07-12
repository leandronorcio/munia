'use client';
import Button from '@/components/ui/Button';
import { ActionsPlus, Mail } from '@/svg_components';

export function ProfileActionButtons() {
  return (
    <div className="absolute -bottom-16 right-2 md:right-0 flex flex-row items-center gap-2 md:gap-4">
      <Button Icon={ActionsPlus} onClick={() => {}} shape="pill" size="small">
        Follow
      </Button>
      <Button Icon={Mail} onClick={() => {}} mode="secondary" size="small" />
    </div>
  );
}
