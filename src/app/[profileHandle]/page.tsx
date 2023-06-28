import { Posts } from '@/components/Posts';

// Posts sub-page.
export default async function Page({
  params,
}: {
  params: { profileHandle: string };
}) {
  return <Posts type="profile" userId={params.profileHandle} />;
}
