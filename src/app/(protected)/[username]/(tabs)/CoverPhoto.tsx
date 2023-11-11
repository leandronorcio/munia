'use client';
import Button from '@/components/ui/Button';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { cn } from '@/lib/cn';
import SvgImage from '@/svg_components/Image';

export default function CoverPhoto({
  isOwnProfile,
  photoUrl,
}: {
  isOwnProfile: boolean;
  photoUrl: string | null;
}) {
  const { inputFileRef, openInput, handleChange, isPending } =
    useUpdateProfileAndCoverPhotoClient('cover');
  const { showVisualMediaModal } = useVisualMediaModal();

  return (
    <div className="h-full w-full">
      {photoUrl && (
        <img
          src={photoUrl}
          alt="Cover photo"
          className="absolute h-full w-full object-cover"
        />
      )}
      <button
        aria-label="Open cover photo"
        onClick={() =>
          photoUrl !== null &&
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
        className="absolute h-full w-full cursor-pointer bg-black/30 opacity-0 active:opacity-100 "
      ></button>
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
              Icon={(props) => (
                <SvgImage
                  className={cn(props.className, 'text-primary-foreground')}
                />
              )}
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
