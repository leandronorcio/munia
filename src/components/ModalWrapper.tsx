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
      className="fixed top-0 left-0 w-full h-screen"
      style={{ zIndex }}
    >
      {children}
    </motion.div>
  );
}
