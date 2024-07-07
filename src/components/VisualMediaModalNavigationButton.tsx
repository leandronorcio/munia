'use client';

import { useSwiper } from 'swiper/react';
import { ArrowChevronBack, ArrowChevronForward } from '@/svg_components';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import Button from './ui/Button';

export function VisualMediaModalNavigationButton({
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
      className={cn('custom-swiper-button-prev fixed top-[50%] z-20 translate-y-[-50%]')}
      initial={{ [type === 'prev' ? 'left' : 'right']: '-48px' }}
      animate={{ [type === 'prev' ? 'left' : 'right']: '16px' }}
      exit={{ [type === 'prev' ? 'left' : 'right']: '-48px' }}
      whileHover={{ [type === 'prev' ? 'left' : 'right']: '12px' }}>
      <Button
        Icon={type === 'prev' ? ArrowChevronBack : ArrowChevronForward}
        onPress={() => {
          if (type === 'prev') {
            if (isBeginning) return;
            swiper.slidePrev();
          } else {
            if (isEnd) return;
            swiper.slideNext();
          }
        }}
        isDisabled={(type === 'prev' && isBeginning) || (type === 'next' && isEnd)}
      />
    </motion.div>
  );
}
