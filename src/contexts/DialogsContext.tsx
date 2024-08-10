'use client';

import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useOverlayTriggerState } from 'react-stately';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { TextAreaWithMentionsAndHashTags } from '@/components/TextAreaWithMentionsAndHashTags';
import { AnimatePresence } from 'framer-motion';
import { AlertDialog } from '../components/AlertDialog';
import { Modal } from '../components/Modal';

interface BasicDialogType {
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  message: string;
  onConfirm?: () => void;
  promptLabel?: string;
  initialPromptValue?: string;
  promptType?: 'input' | 'textarea';
  onSubmit?: (value: string) => void;
}

export const DialogsContext = createContext<{
  setShown: (isOpen: boolean) => void;
  setDialog: Dispatch<SetStateAction<BasicDialogType>>;
}>({
  setShown: () => {},
  setDialog: () => {},
});

export function DialogsContextProvider({ children }: { children: React.ReactNode }) {
  const state = useOverlayTriggerState({});
  const [dialog, setDialog] = useState<BasicDialogType>({
    type: 'alert',
    title: '',
    message: '',
  });

  const [promptValue, setPromptValue] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (dialog.initialPromptValue) setPromptValue(dialog.initialPromptValue);
  }, [dialog.initialPromptValue]);

  useEffect(() => {
    if (state.isOpen === false) return;

    // If there is a prompt (input or textarea), focus it on initial render
    if (dialog.promptType === 'input') {
      if (inputRef.current === null) return;
      inputRef.current.focus();
    } else {
      if (textareaRef.current === null) return;
      textareaRef.current.focus();
    }
  }, [state.isOpen, dialog.promptType]);

  const hide = useCallback(() => {
    state.close();
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
  }, [state, setDialog]);

  const handleAffirmative = useCallback(() => {
    if (dialog.type === 'alert') {
      hide();
      return;
    }
    if (dialog.type === 'confirm') {
      dialog?.onConfirm?.();
      hide();
      return;
    }
    if (dialog.type === 'prompt') {
      if (promptValue === '') {
        setInputError('This cannot be empty.');
        return;
      }
      dialog?.onSubmit?.(promptValue);
      hide();
    }
  }, [dialog, hide, promptValue]);

  const affirmativeTexts = {
    alert: 'Okay',
    confirm: 'Confirm',
    prompt: 'Submit',
  };

  // This prevents unncessesary rerenders of the `DialogsContext` consumers
  // Even if the states change, the consumers will not rerender
  const memoizedValues = useMemo(
    () => ({
      setShown: state.setOpen,
      setDialog,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Don't add `state.setOpen` here, otherwise our memoization technique won't work
  );

  return (
    <DialogsContext.Provider value={memoizedValues}>
      {children}
      <AnimatePresence>
        {state.isOpen && (
          <Modal state={state}>
            <AlertDialog title={dialog.title} onClose={state.close}>
              <p className="text-center text-lg text-muted-foreground">{dialog.message}</p>
              <div className="w-full">
                {dialog.type === 'prompt' && (
                  <div>
                    {dialog.promptType === 'input' ? (
                      <TextInput
                        value={promptValue}
                        onChange={setPromptValue}
                        placeholder={dialog.promptLabel || 'Input here'}
                        ref={inputRef}
                        errorMessage={inputError || undefined}
                      />
                    ) : (
                      <TextAreaWithMentionsAndHashTags
                        content={promptValue}
                        setContent={setPromptValue}
                        placeholder={dialog.promptLabel || 'Input here'}
                        errorMessage={inputError || undefined}
                      />
                    )}
                  </div>
                )}
              </div>
              <Button onPress={handleAffirmative} shape="pill" expand="half">
                {affirmativeTexts[dialog.type]}
              </Button>
              {dialog.type !== 'alert' && (
                <Button onPress={hide} shape="pill" mode="ghost">
                  Cancel
                </Button>
              )}
            </AlertDialog>
          </Modal>
        )}
      </AnimatePresence>
    </DialogsContext.Provider>
  );
}
