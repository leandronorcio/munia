'use client';

import { Gender, RelationshipStatus, User } from '@prisma/client';
import { AboutItem } from './AboutItem';
import { useState } from 'react';
import { TextInput } from '@/components/ui/TextInput';
import { DateInput } from '@/components/ui/DateInput';
import { Select } from '@/components/ui/Select';
import { format } from 'date-fns';
import { reverseCapitalizeWithUnderscores } from '@/lib/reverseCapitalizeWithUnderscores';
import { capitalizeWithUnderscores } from '@/lib/capitalizeWithUnderscores';
import { useSessionUserData } from '@/hooks/useSessionUserData';

export function About({
  profile,
  isOwnProfile,
}: {
  profile: User;
  isOwnProfile: boolean;
}) {
  const [user] = useSessionUserData();
  // Use `profileData` for displaying the values
  const profileData = (isOwnProfile && user) || profile;
  // Use this state for controlling the inputs
  const [profileDataControl, setProfileDataControl] = useState<User>({
    ...profile,
  });

  return (
    <div className="flex flex-col gap-3">
      <AboutItem
        field="name"
        value={profileData.name}
        label="Name"
        isOwnProfile={isOwnProfile}
      >
        <TextInput
          label="Enter name"
          value={profileDataControl.name || ''}
          name="name"
          onChange={(text) => {
            setProfileDataControl((prev) => ({
              ...prev,
              name: text,
            }));
          }}
        />
      </AboutItem>

      <AboutItem
        field="username"
        value={profileData.username}
        label="Username"
        isOwnProfile={isOwnProfile}
      >
        <TextInput
          label="Enter Username"
          value={profileDataControl.username || ''}
          name="username"
          onChange={(text) => {
            setProfileDataControl((prev) => ({
              ...prev,
              username: text,
            }));
          }}
        />
      </AboutItem>

      <AboutItem
        field="email"
        value={profileData.email}
        label="Email"
        isOwnProfile={isOwnProfile}
      >
        <TextInput
          label="Enter Email"
          value={profileDataControl.email || ''}
          name="email"
          onChange={(text) => {
            setProfileDataControl((prev) => ({
              ...prev,
              email: text,
            }));
          }}
        />
      </AboutItem>

      <AboutItem
        field="bio"
        value={profileData.bio}
        label="Bio"
        isOwnProfile={isOwnProfile}
      >
        <TextInput
          label="Enter Bio"
          value={profileDataControl.bio || ''}
          name="bio"
          onChange={(text) => {
            setProfileDataControl((prev) => ({
              ...prev,
              bio: text,
            }));
          }}
        />
      </AboutItem>

      <AboutItem
        field="website"
        value={profileData.website}
        label="Website"
        isOwnProfile={isOwnProfile}
      >
        <TextInput
          label="Enter Website"
          value={profileDataControl.website || ''}
          name="website"
          onChange={(text) => {
            setProfileDataControl((prev) => ({
              ...prev,
              website: text,
            }));
          }}
        />
      </AboutItem>

      <AboutItem
        field="gender"
        value={
          profileData.gender &&
          reverseCapitalizeWithUnderscores(profileData.gender)
        }
        label="Gender"
        isOwnProfile={isOwnProfile}
      >
        <Select
          label="Enter Gender"
          value={
            (profileDataControl.gender &&
              reverseCapitalizeWithUnderscores(profileDataControl.gender)) ||
            ''
          }
          name="gender"
          options={['Male', 'Female', 'Nonbinary']}
          onChange={(value) => {
            setProfileDataControl((prev) => ({
              ...prev,
              gender: value.toUpperCase() as Gender,
            }));
          }}
        />
      </AboutItem>

      <AboutItem
        field="relationshipStatus"
        value={
          profileData.relationshipStatus &&
          reverseCapitalizeWithUnderscores(profileData.relationshipStatus)
        }
        label="Relationship Status"
        isOwnProfile={isOwnProfile}
      >
        <Select
          label="Enter Relationship Status"
          value={
            (profileDataControl.relationshipStatus &&
              reverseCapitalizeWithUnderscores(
                profileDataControl.relationshipStatus,
              )) ||
            ''
          }
          name="relationshipStatus"
          options={['Single', 'Married', 'Engaged', 'In a relationship']}
          onChange={(value) => {
            setProfileDataControl((prev) => ({
              ...prev,
              relationshipStatus: capitalizeWithUnderscores(
                value,
              ) as RelationshipStatus,
            }));
          }}
        />
      </AboutItem>

      <AboutItem
        field="birthDate"
        value={
          profileData.birthDate !== null
            ? format(new Date(profileData.birthDate!), 'MMMM d yyyy')
            : null
        }
        label="Birth Date"
        isOwnProfile={isOwnProfile}
      >
        <DateInput
          label="Enter Birth Date"
          value={new Date(profileDataControl.birthDate!)}
          name="birthDate"
          onChange={(date) => {
            setProfileDataControl((prev) => ({
              ...prev,
              birthDate: date,
            }));
          }}
        />
      </AboutItem>

      <AboutItem
        field="phoneNumber"
        value={profileData.phoneNumber}
        label="Phone Number"
        isOwnProfile={isOwnProfile}
      >
        <TextInput
          label="Enter Phone Number"
          value={profileDataControl.phoneNumber || ''}
          name="phoneNumber"
          onChange={(text) => {
            setProfileDataControl((prev) => ({
              ...prev,
              phoneNumber: text,
            }));
          }}
        />
      </AboutItem>

      <AboutItem
        field="address"
        value={profileData.address}
        label="Address"
        isOwnProfile={isOwnProfile}
      >
        <TextInput
          label="Enter Address"
          value={profileDataControl.address || ''}
          name="address"
          onChange={(text) => {
            setProfileDataControl((prev) => ({
              ...prev,
              address: text,
            }));
          }}
        />
      </AboutItem>
    </div>
  );
}
