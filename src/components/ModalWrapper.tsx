import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

export default function ModalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ backdropFilter: 'blur(0)' }}
      animate={{ backdropFilter: 'blur(4px)' }}
      exit={{ backdropFilter: 'blur(0)' }}
      className={cn(
        'fixed top-0 left-0 z-20 w-full h-screen flex justify-center items-end md:items-center'
      )}
    >
      {children}
    </motion.div>
  );
}
