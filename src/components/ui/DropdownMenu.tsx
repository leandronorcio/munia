'use client';
import { MoreVert } from '@/svg_components';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';
import Button from './Button';

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

  const toggle = () => setVisible((prev) => !prev);

  return (
    <div className="relative inline-block" ref={ref}>
      {trigger ? (
        <div onClick={toggle}>{trigger}</div>
      ) : (
        <Button onPress={toggle} Icon={MoreVert} mode="ghost" size="small" />
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
