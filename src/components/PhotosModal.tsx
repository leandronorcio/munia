'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Navigation, Pagination, Keyboard } from 'swiper';
import { useEffect, useState } from 'react';
import { PhotosModalNavigationButton } from './PhotosModalNavigationButton';
import ModalWrapper from './ModalWrapper';
import { Close } from '@/svg_components';
import { cn } from '@/lib/cn';

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
  const [animation, setAnimation] = useState<'from' | 'to'>('from');

  useEffect(() => {
    setAnimation('to');
  }, []);

  return (
    <ModalWrapper animationState={animation}>
      <Swiper
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSwiper={(swiper) => console.log(swiper)}
        className={cn(
          'w-full h-full transition-opacity duration-500',
          animation === 'from' ? 'opacity-0' : 'opacity-100'
        )}
        zoom={true}
        pagination={{
          clickable: true,
        }}
        keyboard={{ enabled: true }}
        modules={[Zoom, Navigation, Pagination, Keyboard]}
        initialSlide={initialSlide}
      >
        <div
          className="fixed z-20 top-6 right-6 bg-red-400 hover:bg-red-600 p-3 rounded-full cursor-pointer transition-transform hover:scale-110"
          onClick={() => {
            setAnimation('from');
            setTimeout(() => close(), 500);
          }}
        >
          <Close stroke="white" strokeWidth={4} width={24} height={24} />
        </div>
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
    </ModalWrapper>
  );
}
