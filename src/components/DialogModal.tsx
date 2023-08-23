import { useRef } from 'react';
import { Overlay, useModalOverlay } from 'react-aria';
import { OverlayTriggerState } from 'react-stately';
import Button from './ui/Button';
import { Close } from '@/svg_components';
import { motion } from 'framer-motion';

export function DialogModal({
  state,
  children,
  ...props
}: {
  children: React.ReactNode;
  state: OverlayTriggerState;
}) {
  let ref = useRef(null);
  let { modalProps, underlayProps } = useModalOverlay(props, state, ref);

  return (
    <Overlay>
      <div {...underlayProps} className="fixed inset-0 z-30 w-screen">
        <motion.div
          initial={{ backdropFilter: 'blur(0)', opacity: 0 }}
          animate={{ backdropFilter: 'blur(4px)', opacity: 1 }}
          exit={{ backdropFilter: 'blur(0)', opacity: 0 }}
          className="fixed flex h-screen w-full items-center justify-center "
        >
          <motion.div
            initial={{ marginTop: '-96px' }}
            animate={{ marginTop: '0px' }}
            exit={{ marginTop: '-96px' }}
          >
            <div
              {...modalProps}
              ref={ref}
              className="relative w-full gap-6 rounded-t-3xl bg-white px-5 py-14 md:w-[600px] md:rounded-3xl md:px-32 md:py-24"
            >
              <div className="absolute right-6 top-6 md:right-8 md:top-8">
                <Button Icon={Close} mode="ghost" onPress={state.close} />
              </div>
              {children}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Overlay>
  );
}
