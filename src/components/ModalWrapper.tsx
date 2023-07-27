import { motion } from 'framer-motion';

export default function ModalWrapper({
  children,
  zIndex,
}: {
  children: React.ReactNode;
  zIndex: number;
}) {
  return (
    <motion.div
      initial={{ backdropFilter: 'blur(0)', opacity: 0 }}
      animate={{ backdropFilter: 'blur(4px)', opacity: 1 }}
      exit={{ backdropFilter: 'blur(0)', opacity: 0 }}
      className="fixed left-0 top-0 h-screen w-full"
      style={{ zIndex }}
    >
      {children}
    </motion.div>
  );
}
