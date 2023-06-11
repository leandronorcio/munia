'use client';

import Button from '@/components/Button';
import { cn } from '@/lib/cn';
import { Close } from '@/svg_components';
import { createContext, useState } from 'react';
import { createPortal } from 'react-dom';

const BasicModalContext = createContext<{
  shown: boolean;
  alert: ({ title, message }: { title: string; message: string }) => void;
  confirm: ({
    title,
    message,
    actionOnConfirm,
  }: {
    title: string;
    message: string;
    actionOnConfirm: Function;
  }) => void;
}>({
  shown: false,
  alert: () => {},
  confirm: () => {},
});

function BasicModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const [animation, setAnimation] = useState<'from' | 'to'>('from');
  const [dialog, setDialog] = useState<{
    type: 'alert' | 'confirm';
    title: string;
    message: string;
    actionOnConfirm?: Function;
  }>({
    type: 'alert',
    title: '',
    message: '',
  });

  const show = () => {
    setShown(true);
    setTimeout(() => setAnimation('to'), 1);
  };

  const hide = () => {
    setAnimation('from');
    setTimeout(() => setShown(false), 500);
  };

  const alert = ({ title, message }: { title: string; message: string }) => {
    setDialog({
      type: 'alert',
      title,
      message,
    });
    show();
  };

  const confirm = ({
    title,
    message,
    actionOnConfirm,
  }: {
    title: string;
    message: string;
    actionOnConfirm: Function;
  }) => {
    setDialog({
      type: 'confirm',
      title,
      message,
      actionOnConfirm,
    });
    show();
  };

  return (
    <BasicModalContext.Provider value={{ shown: shown, alert, confirm }}>
      {shown &&
        createPortal(
          <div
            className={cn(
              'fixed top-0 left-0 transition-all duration-500 w-full h-screen flex justify-center items-end md:items-center z-10 shadow-lg',
              animation === 'from' ? 'backdrop-blur-none' : 'backdrop-blur-sm'
            )}
          >
            <div
              className={cn(
                'transition-all duration-500 w-full px-5 md:px-32 py-14 md:py-24 md:w-3/5 lg:w-1/2 xl:w-2/5 rounded-t-3xl md:rounded-3xl bg-white flex flex-col items-center gap-6 relative',
                animation === 'from' ? '-mt-24' : 'mt-0',
                animation === 'from' ? 'opacity-0' : 'opacity-1'
              )}
            >
              <Close
                className="absolute top-6 md:top-8 right-6 md:right-8 cursor-pointer stroke-gray-900 hover:stroke-gray-500"
                width={24}
                height={24}
                onClick={hide}
              />
              <h1 className="text-center text-4xl md:text-5xl font-bold">
                {dialog.title}
              </h1>
              <p className="text-lg text-center text-gray-700">
                {dialog.message}
              </p>
              <Button
                onClick={() => {
                  hide();
                  dialog.type === 'alert'
                    ? hide()
                    : dialog.actionOnConfirm && dialog.actionOnConfirm();
                }}
                shape="pill"
                size="long"
              >
                {dialog.type === 'alert' ? 'Okay' : 'Confirm'}
              </Button>
              {dialog.type === 'confirm' && (
                <Button onClick={hide} shape="pill" size="long" mode="ghost">
                  Cancel
                </Button>
              )}
            </div>
          </div>,
          document.body
        )}
      {children}
    </BasicModalContext.Provider>
  );
}

export { BasicModalContext, BasicModalContextProvider };
