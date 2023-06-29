'use client';

import ModalContentWrapper from '@/components/ModalContentWrapper';
import ModalWrapper from '@/components/ModalWrapper';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { Close } from '@/svg_components';
import { AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState } from 'react';
import { ToastContext } from './ToastContext';

const BasicDialogsContext = createContext<{
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
  prompt: ({
    title,
    message,
    promptLabel,
    initialPromptValue,
    actionOnSubmit,
  }: {
    title: string;
    message?: string | undefined;
    promptLabel?: string | undefined;
    initialPromptValue?: string | undefined;
    actionOnSubmit: (value: string) => void;
  }) => void;
}>({
  shown: false,
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
    actionOnConfirm?: Function;
    actionOnSubmit?: (value: string) => void;
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
      actionOnConfirm: undefined,
      actionOnSubmit: undefined,
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

  const prompt = ({
    title,
    message = '',
    promptLabel,
    initialPromptValue,
    actionOnSubmit,
  }: {
    title: string;
    message?: string;
    promptLabel?: string;
    initialPromptValue?: string;
    actionOnSubmit: (value: string) => void;
  }) => {
    setDialog({
      type: 'prompt',
      title,
      message,
      promptLabel,
      actionOnSubmit,
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
      dialog.actionOnConfirm && dialog.actionOnConfirm();
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
      dialog.actionOnSubmit && dialog.actionOnSubmit(promptValue);
      hide();
    }
  };

  return (
    <BasicDialogsContext.Provider
      value={{ shown: shown, alert, confirm, prompt }}
    >
      <AnimatePresence>
        {shown && (
          <ModalWrapper key="basic-dialogs-modal-wrapper">
            <ModalContentWrapper>
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
