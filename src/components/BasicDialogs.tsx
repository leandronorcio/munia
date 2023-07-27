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
import { TextArea } from './ui/TextArea';

export function BasicDialogs() {
  const { shown, dialog } = useContext(BasicDialogsContextData);
  const { setShown, setDialog } = useContext(BasicDialogsContextApi);
  const [promptValue, setPromptValue] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (dialog.initialPromptValue) setPromptValue(dialog.initialPromptValue);
  }, [dialog.initialPromptValue]);

  useEffect(() => {
    if (shown === false) return;
    if (dialog.promptType === 'input') {
      if (inputRef.current === null) return;
      inputRef.current.focus();
    } else {
      if (textareaRef.current === null) return;
      textareaRef.current.focus();
    }
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
    setInputError('');
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
        setInputError('This cannot be empty.');
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
              className="absolute right-6 top-6 md:right-8 md:top-8"
              onClick={hide}
            />
            <h1 className="text-center text-4xl font-bold md:text-5xl">
              {dialog.title}
            </h1>
            <p className="text-center text-lg text-gray-700">
              {dialog.message}
            </p>
            <div>
              {dialog.type === 'prompt' && (
                <>
                  {dialog.promptType === 'input' ? (
                    <TextInput
                      value={promptValue}
                      onChange={(e) => setPromptValue(e.target.value)}
                      placeholder={dialog.promptLabel || 'Input here'}
                      ref={inputRef}
                      error={inputError}
                    />
                  ) : (
                    <TextArea
                      value={promptValue}
                      onChange={(e) => setPromptValue(e.target.value)}
                      placeholder={dialog.promptLabel || 'Input here'}
                      ref={textareaRef}
                      error={inputError}
                      filled
                    />
                  )}
                </>
              )}
            </div>
            <Button onClick={handleAffirmative} shape="pill" expand="half">
              {affirmativeTexts[dialog.type]}
            </Button>
            {dialog.type !== 'alert' && (
              <Button onClick={hide} shape="pill" mode="ghost">
                Cancel
              </Button>
            )}
          </ModalContentWrapper>
        </ModalWrapper>
      )}
    </AnimatePresence>
  );
}
