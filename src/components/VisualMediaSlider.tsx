import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Navigation, Pagination, Keyboard } from 'swiper';
import { useEffect, useState } from 'react';
import { VisualMediaModalNavigationButton } from './VisualMediaModalNavigationButton';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import { VisualMediaModalType } from '@/contexts/VisualMediaModalContext';
import Button from './ui/Button';
import { Close } from '@/svg_components';
import { useFocusManager } from 'react-aria';

export default function VisualMediaSlider({
  visualMedia,
  initialSlide,
  onClose,
}: VisualMediaModalType & { onClose: () => void }) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const focusManager = useFocusManager();

  useEffect(() => {
    // When disabling a button, the focus should be manually set
    // to not lose the focus scope trap within the dialog: https://github.com/adobe/react-spectrum/issues/1164#issuecomment-717394520
    if (isBeginning) focusManager.focusLast();
    if (isEnd) focusManager.focusPrevious();
  }, [isBeginning, isEnd]);

  return (
    <Swiper
      onSlideChange={({ isBeginning, isEnd }) => {
        setIsBeginning(isBeginning);
        setIsEnd(isEnd);
      }}
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
          onPress={onClose}
          Icon={Close}
          mode="ghost"
          className="bg-muted/60"
        />
      </motion.div>
      {visualMedia.length > 1 && (
        <>
          <VisualMediaModalNavigationButton
            type="prev"
            isBeginning={isBeginning}
            isEnd={isEnd}
          />
          <VisualMediaModalNavigationButton
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
  );
}
