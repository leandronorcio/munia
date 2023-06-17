'use client';

import Button from '@/components/ui/Button';
import { ActionsPlus, Mail } from '@/svg_components';

export default function Profile() {
  const handleProfilePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, files } = e.target;
    const formData = new FormData();

    if (files == null) return;
    const file = files[0];

    formData.append(name, file, file.name);

    const response = await fetch('/api/profilephoto', {
      method: 'POST',
      body: formData,
    });

    console.log(await response.json());
  };

  return (
    <div>
      <div className="relative mb-28">
        <div className="h-72 bg-violet-300 rounded-3xl"></div>
        <div className="absolute -bottom-24 bg-red-200 w-48 h-48 rounded-full  border-8 border-white"></div>
        <div className="absolute -bottom-14 right-0 flex flex-row gap-4">
          <Button
            Icon={Mail}
            onClick={() => {}}
            size="small"
            mode="secondary"
          />
          <Button Icon={ActionsPlus} onClick={() => {}} size="small">
            Follow
          </Button>
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-1">Leandro Norcio</h1>
      <div className="flex flex-row">
        <p className="text-lg text-gray-600 mr-4">@client123456</p>
        <p className="text-lg mr-6">&bull;</p>
        <p className="text-lg mr-6 font-semibold">
          <span>0</span> <span className="text-gray-500">Followers</span>
        </p>
        <p className="text-lg mr-6">&bull;</p>
        <p className="text-lg font-semibold">
          <span>0</span> <span className="text-gray-500">Following</span>
        </p>
      </div>
    </div>
  );
}
