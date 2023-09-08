'use client';

import { WeatherMoon, WeatherSun } from '@/svg_components';
import { Switch } from './ui/Switch';
import { useTheme } from '@/hooks/useTheme';

export function DarkModeSwitch() {
  const { isDarkMode, handleThemeChange } = useTheme();

  return (
    <Switch
      isSelected={isDarkMode}
      onChange={handleThemeChange}
      aria-label="Dark mode switch"
      renderIcon={() =>
        isDarkMode ? (
          <WeatherMoon className="h-4 w-4 stroke-primary" />
        ) : (
          <WeatherSun className="h-4 w-5 stroke-primary-foreground" />
        )
      }
    />
  );
}
