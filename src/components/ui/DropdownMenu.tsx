'use client';
import { MoreVert } from '@/svg_components';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';

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
  const [ref] = useClickOutside(() => setVisible(false));

  return (
    <div className="relative inline-block" ref={ref}>
      {trigger ? (
        <div onClick={() => setVisible((prev) => !prev)}>{trigger}</div>
      ) : (
        <div
          className="cursor-pointer rounded-full p-3 hover:bg-slate-200"
          onClick={() => setVisible((prev) => !prev)}
        >
          <MoreVert fill="black" height={24} width={24} />
        </div>
      )}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: visible ? 1 : 0, originX: '100%', originY: 0 }}
        className="absolute right-0 top-full z-10 cursor-pointer rounded-xl border border-gray-300 bg-slate-100 py-2"
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
