'use client';

import { useSwiper } from 'swiper/react';
import { ArrowChevronBack, ArrowChevronForward } from '@/svg_components';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';
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
  const onPress = useCallback(() => {
    if (type === 'prev') {
      if (isBeginning) return;
      swiper.slidePrev();
    } else {
      if (isEnd) return;
      swiper.slideNext();
    }
  }, [isBeginning, isEnd, swiper, type]);

  const motionProps = useMemo(() => {
    const side = type === 'prev' ? 'left' : 'right';
    return {
      initial: { [side]: '-48px' },
      animate: { [side]: '16px' },
      exit: { [side]: '-48px' },
      whileHover: { [side]: '12px' },
    };
  }, [type]);

  return (
    <motion.div className={cn('custom-swiper-button-prev fixed top-[50%] z-20 translate-y-[-50%]')} {...motionProps}>
      <Button
        Icon={type === 'prev' ? ArrowChevronBack : ArrowChevronForward}
        onPress={onPress}
        isDisabled={(type === 'prev' && isBeginning) || (type === 'next' && isEnd)}
      />
    </motion.div>
  );
}
