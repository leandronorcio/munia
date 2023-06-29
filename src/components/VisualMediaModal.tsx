'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Navigation, Pagination, Keyboard } from 'swiper';
import { useState } from 'react';
import { PhotosModalNavigationButton } from './PhotosModalNavigationButton';
import ModalWrapper from './ModalWrapper';
import { Close } from '@/svg_components';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

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

  return (
    <ModalWrapper zIndex={20}>
      <Swiper
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSwiper={(swiper) => console.log(swiper)}
        className={cn('w-full h-full transition-opacity duration-500')}
        zoom={true}
        pagination={{
          clickable: true,
        }}
        keyboard={{ enabled: true }}
        modules={[Zoom, Navigation, Pagination, Keyboard]}
        initialSlide={initialSlide}
      >
        <motion.div
          initial={{ top: '-56px' }}
          animate={{ top: '16px' }}
          exit={{ top: '-56px' }}
          whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
          className="fixed z-20 right-4 bg-red-400 hover:bg-red-600 p-3 rounded-full cursor-pointer"
          onClick={() => {
            close();
          }}
        >
          <Close stroke="white" strokeWidth={4} width={24} height={24} />
        </motion.div>
        {visualMedia.length > 1 && (
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

        {visualMedia.map((visualMedia, i) => {
          const { type, url } = visualMedia;
          return (
            <SwiperSlide key={i}>
              <div className="swiper-zoom-container">
                {type === 'PHOTO' ? (
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
