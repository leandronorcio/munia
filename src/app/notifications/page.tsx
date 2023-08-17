import { Notifications } from '@/app/notifications/Notifications';

export default async function Page() {
  return (
    <div className="pt-4">
      <h1 className="mb-6 text-4xl font-bold">Notifications</h1>
      <Notifications />
    </div>
  );
}
