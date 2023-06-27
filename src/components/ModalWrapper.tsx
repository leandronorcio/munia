import { motion } from 'framer-motion';

export default function ModalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ backdropFilter: 'blur(0)', opacity: 0 }}
      animate={{ backdropFilter: 'blur(4px)', opacity: 1 }}
      exit={{ backdropFilter: 'blur(0)', opacity: 0 }}
      className="fixed top-0 left-0 z-20 w-full h-screen flex justify-center items-end md:items-center"
    >
      {children}
    </motion.div>
  );
}
