'use client';

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
    <div className="bg-red-200">
      <h1>Profile</h1>
    </div>
  );
}
