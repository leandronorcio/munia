import { Notifications } from './Notifications';

export const metadata = {
  title: 'Munia | Notifications',
};

export default async function Page() {
  return (
    <div className="px-4 pt-4">
      <Notifications />
    </div>
  );
}
