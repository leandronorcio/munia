'use client';

import Button from '@/components/ui/Button';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import SvgImage from '@/svg_components/Image';
import { useCallback } from 'react';

export default function CoverPhoto({ isOwnProfile, photoUrl }: { isOwnProfile: boolean; photoUrl: string | null }) {
  const { inputFileRef, openInput, handleChange, isPending } = useUpdateProfileAndCoverPhotoClient('cover');
  const { showVisualMediaModal } = useVisualMediaModal();
  const openCoverPhoto = useCallback(() => {
    if (photoUrl) {
      showVisualMediaModal({
        visualMedia: [
          {
            type: 'PHOTO',
            url: photoUrl,
          },
        ],
        initialSlide: 0,
      });
    }
  }, [photoUrl, showVisualMediaModal]);

  return (
    <div className="h-full w-full">
      {photoUrl && <img src={photoUrl} alt="" className="absolute h-full w-full object-cover" />}
      <button
        type="button"
        aria-label="Open cover photo"
        onClick={openCoverPhoto}
        className="absolute h-full w-full cursor-pointer bg-black/30 opacity-0 active:opacity-100"
      />
      {isOwnProfile && (
        <label>
          <div className="absolute bottom-4 right-4">
            <input
              type="file"
              name="file"
              ref={inputFileRef}
              onChange={handleChange}
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
            />
            <Button
              Icon={SvgImage}
              iconClassName="text-primary-foreground"
              onPress={openInput}
              size="small"
              loading={isPending}
            />
          </div>
        </label>
      )}
    </div>
  );
}
