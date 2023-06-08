'use client';
import Button from '@/components/Button';
import { Camera } from '@/svg_components';

export function EditCoverPhotoButton() {
  return (
    <div className="absolute right-4 bottom-4">
      <Button Icon={Camera} onClick={() => {}} shape="pill" />
    </div>
  );
}
