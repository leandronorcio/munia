import { cn } from '@/lib/cn';

export default function ModalWrapper({
  children,
  animationState,
}: {
  children: React.ReactNode;
  animationState: AnimationState;
}) {
  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-20 transition-all duration-500 w-full h-screen flex justify-center items-end md:items-center',
        animationState === 'from' ? 'backdrop-blur-none' : 'backdrop-blur-sm'
      )}
    >
      {children}
    </div>
  );
}
