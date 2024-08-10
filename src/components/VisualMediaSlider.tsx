/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import { Zoom, Navigation, Pagination, Keyboard } from 'swiper';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import { Close } from '@/svg_components';
import { useFocusManager } from 'react-aria';
import { GetVisualMedia } from '@/types/definitions';
import Button from './ui/Button';
import { VisualMediaModalNavigationButton } from './VisualMediaModalNavigationButton';

export default function VisualMediaSlider({
  visualMedia,
  initialSlide,
  onClose,
}: {
  visualMedia: GetVisualMedia[];
  initialSlide: number;
  onClose: () => void;
}) {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const focusManager = useFocusManager();

  useEffect(() => {
    // When disabling a button, the focus should be manually set
    // to not lose the focus scope trap within the dialog:
    // https://github.com/adobe/react-spectrum/issues/1164#issuecomment-717394520
    if (isBeginning) focusManager?.focusLast(); // focus the next button
    if (isEnd) focusManager?.focusPrevious(); // focus the previous button
  }, [isBeginning, isEnd, focusManager]);

  const onSlideChange = useCallback((swiper: SwiperClass) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);
  const swiperModules = useMemo(() => [Zoom, Navigation, Pagination, Keyboard], []);

  return (
    <Swiper
      onSlideChange={onSlideChange}
      className={cn('h-full w-full transition-opacity duration-500')}
      zoom
      pagination={{
        clickable: true,
      }}
      keyboard={{ enabled: true }}
      modules={swiperModules}
      initialSlide={initialSlide}>
      <motion.div
        initial={{ top: '-56px' }}
        animate={{ top: '16px' }}
        exit={{ top: '-56px' }}
        className="fixed right-4 z-20">
        <Button onPress={onClose} Icon={Close} mode="ghost" className="bg-secondary" />
      </motion.div>
      {visualMedia.length > 1 && (
        <>
          <VisualMediaModalNavigationButton type="prev" isBeginning={isBeginning} isEnd={isEnd} />
          <VisualMediaModalNavigationButton type="next" isBeginning={isBeginning} isEnd={isEnd} />
        </>
      )}

      {visualMedia.map(({ type, url }) => {
        return (
          <SwiperSlide key={url}>
            <div className="swiper-zoom-container">
              {type === 'PHOTO' ? (
                <img src={url} alt="Post" className="max-h-full" />
              ) : (
                // eslint-disable-next-line jsx-a11y/media-has-caption
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
