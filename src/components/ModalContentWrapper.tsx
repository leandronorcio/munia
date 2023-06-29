import { motion } from 'framer-motion';

export default function ModalContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="w-full mx-auto top-[100%] translate-y-[-100%] md:top-[50%] md:translate-y-[-50%] px-5 md:px-32 py-14 md:py-24 md:w-3/5 lg:w-1/2 xl:w-2/5 rounded-t-3xl md:rounded-3xl bg-white flex flex-col items-center gap-6 relative"
      initial={{ marginTop: '-96px' }}
      animate={{ marginTop: '0px' }}
      exit={{ marginTop: '-96px' }}
    >
      {children}
    </motion.div>
  );
}
