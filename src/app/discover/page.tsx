import Button from '@/components/ui/Button';
import ProfilePhoto from '@/components/ui/ProfilePhoto';

function DiscoverProfile() {
  return (
    <div className="flex gap-4">
      <div className="w-24 h-24 flex-shrink-0">
        <ProfilePhoto />
      </div>
      <div className="flex flex-col gap-2 justify-center">
        <h2 className=" font-semibold text-3xl text-gray-600">
          Leandro Norcio
        </h2>
        <div className="flex gap-4">
          <Button size="small">Follow</Button>
          <Button mode="secondary" size="small">
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

export default async function Discover() {
  return (
    <div className="p-4 md:p-0">
      <h1 className="font-bold text-4xl mb-6">Discover People</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
        <DiscoverProfile />
        <DiscoverProfile />
        <DiscoverProfile />
      </div>
    </div>
  );
}
