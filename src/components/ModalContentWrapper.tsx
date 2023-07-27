import { motion } from 'framer-motion';

export default function ModalContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="relative top-[100%] mx-auto flex w-full translate-y-[-100%] flex-col items-center gap-6 rounded-t-3xl bg-white px-5 py-14 md:top-[50%] md:w-3/5 md:translate-y-[-50%] md:rounded-3xl md:px-32 md:py-24 lg:w-1/2 xl:w-2/5"
      initial={{ marginTop: '-96px' }}
      animate={{ marginTop: '0px' }}
      exit={{ marginTop: '-96px' }}
    >
      {children}
    </motion.div>
  );
}
