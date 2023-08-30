import { ShouldAnimateContext } from '@/contexts/ShouldAnimateContext';
import { useContext } from 'react';

export function useShouldAnimate() {
  return useContext(ShouldAnimateContext);
}
