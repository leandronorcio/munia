'use client';
import Button from '@/components/Button';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';
import { Camera } from '@/svg_components';
import { User } from '@prisma/client';

export default function CoverPhoto({
  isOwnProfile,
  profile,
}: {
  isOwnProfile: boolean;
  profile: User;
}) {
  const { inputFileRef, openInput, handleChange, photoUrl } =
    useUpdateProfileAndCoverPhotoClient('coverPhoto', profile.coverPhoto);

  return (
    <div
      className="h-72 md:rounded-3xl transition-all bg-cover bg-center"
      style={{
        backgroundImage: photoUrl
          ? `url("${photoUrl}")`
          : 'linear-gradient(95.08deg, #AF45DB 2.49%, #EB7B96 97.19%)',
      }}
    >
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
            <Button Icon={Camera} onClick={openInput} shape="pill" />
          </div>
        </label>
      )}
    </div>
  );
}
