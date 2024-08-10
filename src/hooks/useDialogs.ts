import { DialogsContext } from '@/contexts/DialogsContext';
import { useContext } from 'react';

export function useDialogs() {
  const { setShown, setDialog } = useContext(DialogsContext);

  const show = () => {
    setShown(true);
  };

  const alert = ({ title, message }: { title: string; message: string }) => {
    setDialog({
      type: 'alert',
      title,
      message,
    });
    show();
  };

  const confirm = ({ title, message, onConfirm }: { title: string; message: string; onConfirm: () => void }) => {
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
    promptType = 'input',
    onSubmit,
  }: {
    title: string;
    message?: string;
    promptLabel?: string;
    initialPromptValue?: string;
    promptType?: 'input' | 'textarea';
    onSubmit: (value: string) => void;
  }) => {
    setDialog({
      type: 'prompt',
      title,
      message,
      promptLabel,
      initialPromptValue,
      promptType,
      onSubmit,
    });
    show();
  };

  return { alert, confirm, prompt };
}
