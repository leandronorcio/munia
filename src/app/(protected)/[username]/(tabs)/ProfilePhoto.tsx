'use client';

import Button from '@/components/ui/Button';
import { FallbackProfilePhoto } from '@/components/ui/FallbackProfilePhoto';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { Camera } from '@/svg_components';

export default function ProfilePhoto({
  isOwnProfile,
  name,
  photoUrl,
}: {
  isOwnProfile: boolean;
  name: string;
  photoUrl: string | null;
}) {
  const { inputFileRef, openInput, handleChange, isPending } = useUpdateProfileAndCoverPhotoClient('profile');
  const { showVisualMediaModal } = useVisualMediaModal();

  return (
    <div className="absolute bottom-[-88px] h-44 w-44 border-white bg-cover">
      {photoUrl && (
        <img src={photoUrl} alt="Profile photo" className="absolute h-full w-full rounded-full border-4 object-cover" />
      )}
      {photoUrl ? (
        <button
          aria-label="Open profile photo"
          onClick={() =>
            showVisualMediaModal({
              visualMedia: [
                {
                  type: 'PHOTO',
                  url: photoUrl as string,
                },
              ],
              initialSlide: 0,
            })
          }
          className="absolute h-full w-full cursor-pointer rounded-full bg-black/30 opacity-0 active:opacity-100"
        />
      ) : (
        <FallbackProfilePhoto name={name} className="text-6xl" />
      )}
      {isOwnProfile && (
        <label>
          <div className="absolute bottom-0 right-0">
            <input
              type="file"
              name="file"
              ref={inputFileRef}
              onChange={handleChange}
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
            />
            <Button Icon={Camera} onPress={openInput} size="small" loading={isPending} />
          </div>
        </label>
      )}
    </div>
  );
}
