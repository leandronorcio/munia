import { BasicDialogsContextApi } from '@/contexts/BasicDialogsContext';
import { useContext } from 'react';

export function useBasicDialogs() {
  const { setShown, setDialog } = useContext(BasicDialogsContextApi);

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
      initialPromptValue,
      onSubmit,
    });
    show();
  };

  return { alert, confirm, prompt };
}
