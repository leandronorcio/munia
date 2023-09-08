import { ThemeContext } from '@/contexts/ThemeContext';
import { useContext } from 'react';

export function useTheme() {
  return useContext(ThemeContext);
}
