'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Navigation, Pagination, Keyboard } from 'swiper';
import { useContext, useState } from 'react';
import { PhotosModalNavigationButton } from './PhotosModalNavigationButton';
import ModalWrapper from './ModalWrapper';
import { cn } from '@/lib/cn';
import { AnimatePresence, motion } from 'framer-motion';
import {
  VisualMediaModalContextApi,
  VisualMediaModalContextData,
} from '@/contexts/VisualMediaModalContext';
import Button from './ui/Button';
import { Close } from '@/svg_components';

export default function VisualMediaModal() {
  const { shown, modal } = useContext(VisualMediaModalContextData);
  const { setShown } = useContext(VisualMediaModalContextApi);
  const { visualMedia, initialSlide } = modal;
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <AnimatePresence>
      {shown && (
        <ModalWrapper zIndex={20}>
          <Swiper
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSwiper={(swiper) => console.log(swiper)}
            className={cn('h-full w-full transition-opacity duration-500')}
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
              className="fixed right-4 z-20"
            >
              <Button
                onPress={() => {
                  setShown(false);
                }}
                Icon={Close}
                mode="ghost"
              />
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
      )}
    </AnimatePresence>
  );
}
