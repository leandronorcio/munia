'use client';
import { useSwiper } from 'swiper/react';
import { ArrowChevronBack, ArrowChevronForward } from '@/svg_components';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

export function PhotosModalNavigationButton({
  type,
  isBeginning,
  isEnd,
}: {
  type: 'prev' | 'next';
  isBeginning: boolean;
  isEnd: boolean;
}) {
  const swiper = useSwiper();

  return (
    <motion.div
      className={cn(
        'custom-swiper-button-prev fixed z-20 top-[50%] translate-y-[-50%] bg-violet-700 active:bg-violet-800 p-3 rounded-full cursor-pointer',
        type === 'prev'
          ? isBeginning
            ? 'opacity-50'
            : 'opacity-100'
          : isEnd
          ? 'opacity-50'
          : 'opacity-100'
      )}
      initial={{ [type === 'prev' ? 'left' : 'right']: '-48px' }}
      animate={{ [type === 'prev' ? 'left' : 'right']: '16px' }}
      exit={{ [type === 'prev' ? 'left' : 'right']: '-48px' }}
      whileHover={{ [type === 'prev' ? 'left' : 'right']: '12px' }}
      onClick={() => {
        if (type === 'prev') {
          if (isBeginning) return;
          swiper.slidePrev();
        } else {
          if (isEnd) return;
          swiper.slideNext();
        }
      }}
    >
      {type === 'prev' ? (
        <ArrowChevronBack
          stroke="white"
          strokeWidth={4}
          width={24}
          height={24}
        />
      ) : (
        <ArrowChevronForward
          stroke="white"
          strokeWidth={4}
          width={24}
          height={24}
        />
      )}
    </motion.div>
  );
}
