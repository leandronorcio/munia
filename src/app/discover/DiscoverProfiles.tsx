'use client';
import { DiscoverProfile } from '@/app/discover/DiscoverProfile';
import useOnScreen from '@/hooks/useOnScreen';
import { useToast } from '@/hooks/useToast';
import { useDiscoverProfilesStore } from '@/stores/useDiscoverProfilesStore';
import { CircleActionsSuccess } from '@/svg_components';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { GetUser } from 'types';

export function DiscoverProfiles() {
  const { profiles, isMaxedOut, setProfiles, setIsMaxedOut } =
    useDiscoverProfilesStore(
      ({ profiles, isMaxedOut, setProfiles, setIsMaxedOut }) => ({
        profiles,
        isMaxedOut,
        setProfiles,
        setIsMaxedOut,
      })
    );
  const searchParams = useSearchParams();
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const { showToast } = useToast();

  const fetchProfiles = async () => {
    // Offset the number profiles rendered.
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('offset', profiles.length.toString());

    const res = await fetch(`/api/users?${newSearchParams.toString()}`);
    if (!res.ok) {
      showToast({ type: 'error', title: 'Error Fetching Posts' });
    }

    const retrievedProfiles = (await res.json()) as GetUser[];

    if (retrievedProfiles.length === 0) return setIsMaxedOut(true);
    setProfiles(retrievedProfiles, true);
  };

  useEffect(() => {
    /**
     * When going back to this page, effects will run even if the
     * dependencies did not change, because the component is unmounted then
     * remounted.
     *
     * The <Filter> component resets the profiles state, only fetch when
     * the profiles are indeed reset by cheking if there are no profiles yet.
     */
    if (profiles.length === 0) {
      fetchProfiles();
    }
  }, [searchParams]);

  useEffect(() => {
    // If bottom of screen is showing, and there are fetched,
    // profiles already, try to load the next page of profiles.
    if (!isBottomOnScreen) return;
    if (isMaxedOut) return;

    if (profiles.length > 0) {
      fetchProfiles();
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
