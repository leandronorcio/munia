import { cn } from '@/lib/cn';

export default function ModalContentWrapper({
  children,
  animationState,
}: {
  children: React.ReactNode;
  animationState: AnimationState;
}) {
  return (
    <div
      className={cn(
        'transition-all duration-500 w-full px-5 md:px-32 py-14 md:py-24 md:w-3/5 lg:w-1/2 xl:w-2/5 rounded-t-3xl md:rounded-3xl bg-white flex flex-col items-center gap-6 relative',
        animationState === 'from' ? '-mt-24' : 'mt-0',
        animationState === 'from' ? 'opacity-0' : 'opacity-1'
      )}
    >
      {children}
    </div>
  );
}
