'use client';

import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext<{
  isDarkMode: boolean;
  handleThemeChange: (isSelected: boolean) => void;
}>({ isDarkMode: true, handleThemeChange: () => {} });

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const storageDarkmode = localStorage.getItem('isDarkMode');
    const isDark = storageDarkmode === 'true' || storageDarkmode === null;

    setDarkClass(isDark);
    setIsDarkMode(isDark);
  }, []);

  const setDarkClass = (isSelected: boolean) => {
    if (isSelected) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleThemeChange = (isSelected: boolean) => {
    setDarkClass(isSelected);

    localStorage.setItem('isDarkMode', isSelected ? 'true' : 'false');
    setIsDarkMode(isSelected);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
}
