'use client';
import { DiscoverProfile } from '@/components/DiscoverProfile';
import useOnScreen from '@/hooks/useOnScreen';
import { useToast } from '@/hooks/useToast';
import { CircleActionsSuccess } from '@/svg_components';
import { useEffect, useRef, useState } from 'react';
import { GetUser } from 'types';

export function DiscoverProfiles({
  initialProfiles,
}: {
  initialProfiles: GetUser[];
}) {
  const [profiles, setProfiles] = useState<GetUser[]>(initialProfiles);
  const [isMaxedOut, setIsMaxedOut] = useState(false);
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const { showToast } = useToast();

  const fetchMoreProfiles = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    // Offset the number profiles rendered.
    searchParams.set('offset', profiles.length.toString());

    const res = await fetch(`/api/users?${searchParams.toString()}`);
    if (!res.ok) {
      showToast({ type: 'error', title: 'Error Fetching Posts' });
    }
    const retrievedProfiles = (await res.json()) as GetUser[];
    if (retrievedProfiles.length === 0) return setIsMaxedOut(true);
    setProfiles((prev) => [...prev, ...retrievedProfiles]);
  };

  useEffect(() => {
    // Reset when receiving new initialProfiles.
    setProfiles(initialProfiles);

    // Initial profiles can contain up to 4 profiles only.
    if (initialProfiles.length < 4) {
      setIsMaxedOut(true);
    } else {
      setIsMaxedOut(false);
    }
  }, [initialProfiles]);

  useEffect(() => {
    if (!isBottomOnScreen) return;
    if (isMaxedOut) return;

    // If bottom of screen is showing, and there are initialProfiles,
    // try to load the next page of profiles.
    if (profiles.length > 0) {
      fetchMoreProfiles();
    }
  }, [isBottomOnScreen]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
        {profiles.map((profile) => (
          <DiscoverProfile key={profile.id} user={profile} />
        ))}
      </div>
      <div className="mt-4" ref={bottomElRef}>
        &nbsp;
      </div>
      {isMaxedOut && (
        <div className="grid place-items-center mb-6">
          <div className="px-8 py-6 inline-block rounded-xl bg-green-200">
            <div className="flex items-center gap-4">
              <CircleActionsSuccess
                className="stroke-green-700"
                width={24}
                height={24}
              />
              <p className="text-green-700 font-semibold text-lg">
                All caught up!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
