import { Posts } from '@/components/Posts';

// Posts sub-page.
export default async function Page({ params }: { params: { userId: string } }) {
  return <Posts type="profile" userId={params.userId} />;
}
