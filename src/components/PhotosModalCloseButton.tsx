'use client';
import { Close } from '@/svg_components';

export function PhotosModalCloseButton({ close }: { close: Function }) {
  return (
    <div
      className="fixed z-20 top-6 right-6 bg-red-400 hover:bg-red-600 p-3 rounded-full cursor-pointer transition-transform hover:scale-110"
      onClick={() => close()}
    >
      <Close stroke="white" strokeWidth={4} width={24} height={24} />
    </div>
  );
}
