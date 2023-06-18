'use client';

import PhotosModal from '@/components/PhotosModal';
import { useState } from 'react';
export default function Notifications() {
  const [shown, setShown] = useState(false);

  return (
    <div>
      <button onClick={() => setShown(true)}>Show Photos Modal</button>
      {shown && (
        <PhotosModal
          photos={[
            '/uploads/clilwgdr00002xylvrkxq87r9-1686750515523-profilePhoto.png',
            '/uploads/clilwgdr00002xylvrkxq87r9-1686749825380-profilePhoto.jpeg',
            '/uploads/clilwgdr00002xylvrkxq87r9-1686757530568-profilePhoto.jpeg',
          ]}
          initialSlide={0}
          close={() => setShown(false)}
        />
      )}
    </div>
  );
}
