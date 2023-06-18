'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Navigation, Pagination, Keyboard } from 'swiper';

import { useState } from 'react';
import { PhotosModalNavigationButton } from './PhotosModalNavigationButton';
import { PhotosModalCloseButton } from './PhotosModalCloseButton';

export default function PhotosModal({
  photos,
  initialSlide = 0,
  close,
}: {
  photos: string[];
  initialSlide?: number;
  close: Function;
}) {
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="fixed z-10 top-0 left-0 w-screen h-screen transition-all backdrop-blur-sm">
      <Swiper
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSwiper={(swiper) => console.log(swiper)}
        className="w-full h-full"
        zoom={true}
        pagination={{
          clickable: true,
        }}
        keyboard={{ enabled: true }}
        modules={[Zoom, Navigation, Pagination, Keyboard]}
        initialSlide={initialSlide}
      >
        <PhotosModalCloseButton close={close} />
        {photos.length > 1 && (
          <>
            <PhotosModalNavigationButton
              type="prev"
              isBeginning={isBeginning}
              isEnd={isEnd}
            />
            <PhotosModalNavigationButton
              type="next"
              isBeginning={isBeginning}
              isEnd={isEnd}
            />
          </>
        )}

        {photos.map((photo) => {
          return (
            <SwiperSlide key={photo}>
              <div className="swiper-zoom-container">
                <img src={photo} className="max-h-full" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
