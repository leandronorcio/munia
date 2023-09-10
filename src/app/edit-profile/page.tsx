import { EditProfileForm } from '@/components/EditProfileForm';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

export default function Page() {
  return (
    <ResponsiveContainer className="mx-auto mb-4 px-4 md:px-0">
      <h1 className="my-4 text-3xl font-bold">Edit Profile</h1>
      <EditProfileForm />
    </ResponsiveContainer>
  );
}
