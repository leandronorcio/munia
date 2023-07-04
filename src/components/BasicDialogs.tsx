'use client';
import ModalContentWrapper from '@/components/ModalContentWrapper';
import ModalWrapper from '@/components/ModalWrapper';
import Button from '@/components/ui/Button';
import { CloseButton } from '@/components/ui/CloseButton';
import { TextInput } from '@/components/ui/TextInput';
import {
  BasicDialogsContextApi,
  BasicDialogsContextData,
} from '@/contexts/BasicDialogsContext';
import { useToast } from '@/hooks/useToast';
import { AnimatePresence } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';

export function BasicDialogs() {
  const { shown, dialog } = useContext(BasicDialogsContextData);
  const { setShown, setDialog } = useContext(BasicDialogsContextApi);
  const [promptValue, setPromptValue] = useState('');
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dialog.initialPromptValue) setPromptValue(dialog.initialPromptValue);
  }, [dialog.initialPromptValue]);

  useEffect(() => {
    if (shown === false) return;
    if (inputRef.current === null) return;
    inputRef.current.focus();
  }, [shown]);

  const hide = () => {
    setShown(false);
    setDialog({
      type: 'alert',
      title: '',
      message: '',
      onConfirm: undefined,
      onSubmit: undefined,
      initialPromptValue: '',
    });
    setPromptValue('');
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
        showToast({
          title: 'Empty Input',
          message: 'Please input something.',
          type: 'error',
        });
        return;
      }
      dialog.onSubmit && dialog.onSubmit(promptValue);
      hide();
    }
  };

  const affirmativeTexts = {
    alert: 'Okay',
    confirm: 'Confirm',
    prompt: 'Submit',
  };

  return (
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
                  placeholder={dialog.promptLabel || 'Input here'}
                  ref={inputRef}
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
  );
}
