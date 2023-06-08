'use client';
import Button from '@/components/Button';
import { Camera } from '@/svg_components';

export function EditProfilePhotoButton() {
  return (
    <div className="absolute right-0 bottom-0">
      <Button Icon={Camera} onClick={() => {}} shape="pill" size="small" />
    </div>
  );
}
