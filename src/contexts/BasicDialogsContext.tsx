'use client';

import ModalContentWrapper from '@/components/ModalContentWrapper';
import ModalWrapper from '@/components/ModalWrapper';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState } from 'react';
import { ToastContext } from './ToastContext';
import { CloseButton } from '@/components/ui/CloseButton';

const BasicDialogsContext = createContext<{
  alert: ({ title, message }: { title: string; message: string }) => void;
  confirm: ({
    title,
    message,
    onConfirm,
  }: {
    title: string;
    message: string;
    onConfirm: Function;
  }) => void;
  prompt: ({
    title,
    message,
    promptLabel,
    initialPromptValue,
    onSubmit,
  }: {
    title: string;
    message?: string | undefined;
    promptLabel?: string | undefined;
    initialPromptValue?: string | undefined;
    onSubmit: (value: string) => void;
  }) => void;
}>({
  alert: () => {},
  confirm: () => {},
  prompt: () => {},
});

function BasicDialogsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const [dialog, setDialog] = useState<{
    type: 'alert' | 'confirm' | 'prompt';
    title: string;
    message: string;
    onConfirm?: Function;
    onSubmit?: (value: string) => void;
    promptLabel?: string;
  }>({
    type: 'alert',
    title: '',
    message: '',
  });
  const [promptValue, setPromptValue] = useState('');
  const { toastify } = useContext(ToastContext);

  const show = () => {
    setShown(true);
  };

  const hide = () => {
    setShown(false);
    setDialog({
      type: 'alert',
      title: '',
      message: '',
      onConfirm: undefined,
      onSubmit: undefined,
    });
    setPromptValue('');
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
    onConfirm,
  }: {
    title: string;
    message: string;
    onConfirm: Function;
  }) => {
    setDialog({
      type: 'confirm',
      title,
      message,
      onConfirm,
    });
    show();
  };

  const prompt = ({
    title,
    message = '',
    promptLabel,
    initialPromptValue,
    onSubmit,
  }: {
    title: string;
    message?: string;
    promptLabel?: string;
    initialPromptValue?: string;
    onSubmit: (value: string) => void;
  }) => {
    setDialog({
      type: 'prompt',
      title,
      message,
      promptLabel,
      onSubmit,
    });
    setPromptValue(initialPromptValue || '');
    show();
  };

  const handleAffirmative = () => {
    if (dialog.type === 'alert') {
      hide();
      return;
    }
    if (dialog.type === 'confirm') {
      dialog.onConfirm && dialog.onConfirm();
      hide();
      return;
    }
    if (dialog.type === 'prompt') {
      if (promptValue === '') {
        return toastify({
          type: 'error',
          title: 'Error',
          message: 'Input cannot be empty.',
        });
      }
      dialog.onSubmit && dialog.onSubmit(promptValue);
      hide();
    }
  };

  return (
    <BasicDialogsContext.Provider value={{ alert, confirm, prompt }}>
      <AnimatePresence>
        {shown && (
          <ModalWrapper key="basic-dialogs-modal-wrapper" zIndex={30}>
            <ModalContentWrapper>
              <CloseButton
                className="absolute top-6 md:top-8 right-6 md:right-8"
                onClick={hide}
              />
              <h1 className="text-center text-4xl md:text-5xl font-bold">
                {dialog.title}
              </h1>
              <p className="text-lg text-center text-gray-700">
                {dialog.message}
              </p>
              <div>
                {dialog.type === 'prompt' && (
                  <TextInput
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    label={dialog.promptLabel || 'Input here'}
                  />
                )}
              </div>
              <Button onClick={handleAffirmative} shape="pill" size="long">
                {affirmativeTexts[dialog.type]}
              </Button>
              {dialog.type !== 'alert' && (
                <Button onClick={hide} shape="pill" size="long" mode="ghost">
                  Cancel
                </Button>
              )}
            </ModalContentWrapper>
          </ModalWrapper>
        )}
      </AnimatePresence>
      {children}
    </BasicDialogsContext.Provider>
  );
}

const affirmativeTexts = {
  alert: 'Okay',
  confirm: 'Confirm',
  prompt: 'Submit',
};

export { BasicDialogsContext, BasicDialogsContextProvider };
