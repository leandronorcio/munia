'use client';
import { useSwiper } from 'swiper/react';
import { ArrowChevronBack, ArrowChevronForward } from '@/svg_components';
import { cn } from '@/lib/cn';

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
    <div
      className={cn(
        'custom-swiper-button-prev fixed z-20 top-[50%] translate-y-[-50%] bg-violet-700 p-3 rounded-full cursor-pointer transition-transform',
        type === 'prev' ? 'left-6' : 'right-6',
        type === 'prev'
          ? 'hover:translate-x-[-4px]'
          : 'hover:translate-x-[4px]',
        type === 'prev'
          ? isBeginning
            ? 'opacity-50'
            : 'opacity-100'
          : isEnd
          ? 'opacity-50'
          : 'opacity-100'
      )}
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
    </div>
  );
}
