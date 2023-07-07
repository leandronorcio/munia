import Button from './ui/Button';
import ProfilePhoto from './ui/ProfilePhoto';

export function DiscoverProfile() {
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
        <p className="text-gray-500 mb-4">Lorem ipsum dolor sit amet.</p>
        <div className="flex gap-6">
          <p className="text-lg  font-semibold flex gap-1 justify-center">
            <span>0</span> <span className="text-gray-500">Followers</span>
          </p>
          <p className="text-lg  font-semibold flex gap-1 justify-center">
            <span>0</span> <span className="text-gray-500">Followers</span>
          </p>
        </div>
      </div>
    </div>
  );
}
