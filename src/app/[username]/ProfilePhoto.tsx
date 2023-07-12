'use client';
import Button from '@/components/ui/Button';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { useVisualMediaModal } from '@/hooks/useVisualMediaModal';
import { Camera } from '@/svg_components';
import { User } from '@prisma/client';

export default function ProfilePhoto({
  isOwnProfile,
  profile,
}: {
  isOwnProfile: boolean;
  profile: User;
}) {
  const { inputFileRef, openInput, handleChange } =
    useUpdateProfileAndCoverPhotoClient('profile');
  const { showVisualMediaModal } = useVisualMediaModal();

  return (
    <div
      className="absolute -bottom-24 bg-cover w-48 h-48 rounded-full border-8 border-white"
      style={{
        backgroundImage: `url("${profile.profilePhoto}")`,
      }}
    >
      <div
        onClick={() =>
          showVisualMediaModal({
            visualMedia: [
              {
                type: 'PHOTO',
                url: profile.profilePhoto as string,
              },
            ],
            initialSlide: 0,
          })
        }
        className="w-full h-full absolute bg-black/30 rounded-full opacity-0 active:opacity-100 cursor-pointer"
      ></div>
      {isOwnProfile && (
        <label>
          <div className="absolute right-0 bottom-0">
            <input
              type="file"
              name="file"
              ref={inputFileRef}
              onChange={handleChange}
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
            />
            <Button Icon={Camera} onClick={openInput} size="small" />
          </div>
        </label>
      )}
    </div>
  );
}
