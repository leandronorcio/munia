import Button from '@/components/ui/Button';
import ProfilePhoto from '@/components/ui/ProfilePhoto';

function DiscoverProfile() {
  return (
    <div className="rounded-3xl overflow-hidden gap-4 drop-shadow-sm">
      <div className="py-8 bg-gradient-to-r from-purple-300/50 to-blue-300/50 hover:from-red-300/25 hover:to-green-300/25 flex flex-col items-center gap-4">
        <div className="w-24 h-24">
          <ProfilePhoto />
        </div>
        <Button mode="secondary" shape="pill" size="small" expand="half">
          Follow
        </Button>
      </div>
      <div className="flex flex-col items-center py-8 bg-gray-50">
        <h2 className="font-semibold text-2xl mb-3">Leandro Norcio</h2>
        <p className="text-gray-500 mb-6">Lorem ipsum dolor sit amet.</p>
        <div className="flex">
          <p className="text-lg mr-6 font-semibold">
            <span>0</span> <span className="text-gray-500">Followers</span>
          </p>
          <p className="text-lg mr-6 font-semibold">
            <span>0</span> <span className="text-gray-500">Following</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function Discover() {
  return (
    <div className="p-4 md:p-0">
      <h1 className="font-bold text-4xl mb-6">Discover People</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
        <DiscoverProfile />
        <DiscoverProfile />
        <DiscoverProfile />
      </div>
    </div>
  );
}
