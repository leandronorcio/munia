'use client';
import { MoreVert } from '@/svg_components';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function DropdownMenu({
  children,
  trigger,
  width,
}: {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  width?: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide the DropDown when clicked outside.
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current === null) return;
      if (!ref.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () =>
      document.removeEventListener('click', handleClickOutside, true);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      {trigger ? (
        <div onClick={() => setVisible((prev) => !prev)}>{trigger}</div>
      ) : (
        <div
          className="cursor-pointer p-3 rounded-full hover:bg-slate-200"
          onClick={() => setVisible((prev) => !prev)}
        >
          <MoreVert fill="black" />
        </div>
      )}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: visible ? 1 : 0, originX: '100%', originY: 0 }}
        className="absolute z-10 py-2 bg-slate-100 top-full right-0 border border-gray-300 rounded-xl cursor-pointer"
        style={{
          width: width || '320px',
        }}
        onClick={() => setVisible(false)}
      >
        {children}
      </motion.div>
    </div>
  );
}
