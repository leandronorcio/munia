import { useEffect, useRef } from 'react';

/**
 * Use this hook to do something when the user clicks outside of an element.
 * @param callback - The callback function to execute when the user clicked outside the referenced element.
 * @returns [ref]
 */
export function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) callback();
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, [callback]);

  return [ref];
}
