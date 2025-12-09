'use client';

import {
  AtSign,
  BuildingBusinessOffice,
  Bullhorn,
  Calendar,
  Heart,
  Mail,
  Other,
  Phone,
  Profile,
  WorldNet,
} from '@/svg_components';
import { format } from 'date-fns';
import { capitalize, lowerCase } from 'lodash';
import { GetUser } from '@/types/definitions';
import { AboutItem } from './AboutItem';

interface AboutProps {
  profile: GetUser;
}

export function About({ profile }: AboutProps) {
  const { username, email, name, birthDate, gender, relationshipStatus, phoneNumber, bio, website, address } = profile;

  return (
    <div className="flex flex-col gap-4">
      <AboutItem field="Username" value={username} Icon={AtSign} />
      {email && <AboutItem field="Email" value={email} Icon={Mail} />}
      <AboutItem field="Name" value={name} Icon={Profile} />
      {birthDate && (
        <AboutItem field="Birth Date" value={format(new Date(birthDate), 'MMMM d, yyyy')} Icon={Calendar} />
      )}
      {gender && <AboutItem field="Gender" value={capitalize(gender)} Icon={Other} />}
      {relationshipStatus && (
        <AboutItem field="Relationship Status" value={capitalize(lowerCase(relationshipStatus))} Icon={Heart} />
      )}
      {bio && <AboutItem field="Bio" value={bio} Icon={Bullhorn} />}
      {phoneNumber && <AboutItem field="Phone Number" value={phoneNumber} Icon={Phone} />}
      {website && <AboutItem field="Website" value={website} Icon={WorldNet} />}
      {address && <AboutItem field="Address" value={address} Icon={BuildingBusinessOffice} />}
    </div>
  );
}
