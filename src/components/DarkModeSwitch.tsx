'use client';

import { Switch } from './ui/Switch';
import { useTheme } from '@/hooks/useTheme';

export function DarkModeSwitch() {
  const { isDarkMode, handleThemeChange } = useTheme();

  return <Switch isSelected={isDarkMode} onChange={handleThemeChange} />;
}
