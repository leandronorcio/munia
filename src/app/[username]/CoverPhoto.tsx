'use client';
import Button from '@/components/ui/Button';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { Image } from '@/svg_components';

export default function CoverPhoto({
  isOwnProfile,
  photoUrl,
}: {
  isOwnProfile: boolean;
  photoUrl: string | null;
}) {
  const { inputFileRef, openInput, handleChange, isLoading } =
    useUpdateProfileAndCoverPhotoClient('cover');
  const { showVisualMediaModal } = useVisualMediaModal();

  return (
    <div
      className="w-full h-full bg-cover bg-center"
      style={{
        backgroundImage: photoUrl ? `url("${photoUrl}")` : 'none',
      }}
    >
      <div
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
        className="w-full h-full absolute bg-black/30 md:rounded-3xl opacity-0 active:opacity-100 cursor-pointer"
      ></div>
      {isOwnProfile && (
        <label>
          <div className="absolute right-4 bottom-4">
            <input
              type="file"
              name="file"
              ref={inputFileRef}
              onChange={handleChange}
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
            />
            <Button
              Icon={Image}
              onClick={openInput}
              size="small"
              loading={isLoading}
            />
          </div>
        </label>
      )}
    </div>
  );
}
