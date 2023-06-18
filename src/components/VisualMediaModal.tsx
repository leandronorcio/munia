'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Navigation, Pagination, Keyboard } from 'swiper';
import { useEffect, useState } from 'react';
import { PhotosModalNavigationButton } from './PhotosModalNavigationButton';
import ModalWrapper from './ModalWrapper';
import { Close } from '@/svg_components';
import { cn } from '@/lib/cn';

export default function VisualMediaModal({
  visualMedia,
  initialSlide = 0,
  close,
}: {
  visualMedia: VisualMedia[];
  initialSlide?: number;
  close: Function;
}) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [animation, setAnimation] = useState<AnimationState>('from');

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
          className={cn(
            'fixed z-20 right-4 bg-red-400 hover:bg-red-600 p-3 rounded-full cursor-pointer transition-all duration-500 hover:scale-110',
            animation === 'from' ? '-top-14' : 'top-4'
          )}
          onClick={() => {
            setAnimation('from');
            setTimeout(() => close(), 500);
          }}
        >
          <Close stroke="white" strokeWidth={4} width={24} height={24} />
        </div>
        {visualMedia.length > 1 && (
          <>
            <PhotosModalNavigationButton
              type="prev"
              isBeginning={isBeginning}
              isEnd={isEnd}
              animationState={animation}
            />
            <PhotosModalNavigationButton
              type="next"
              isBeginning={isBeginning}
              isEnd={isEnd}
              animationState={animation}
            />
          </>
        )}

        {visualMedia.map((visualMedia, i) => {
          const { type, url } = visualMedia;
          return (
            <SwiperSlide key={i}>
              <div className="swiper-zoom-container">
                {type === 'photo' ? (
                  <img src={visualMedia.url} className="max-h-full" />
                ) : (
                  <video className="max-h-[75%]" autoPlay controls>
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </ModalWrapper>
  );
}
