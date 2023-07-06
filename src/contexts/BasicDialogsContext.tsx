'use client';
import { BasicDialogs } from '@/components/BasicDialogs';
import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';

/**
 * What's the motivation to rewrite <BasicDialogsContext>?
 *   The previous approach is working nicely, however,
 * when the state of the context changes, all consumers
 * are making unncessary renders regardless of whether
 * they are consuming the changed data or not. This will
 * surely affect performance in the long run.
 *
 * Solution:
 *   Create <BasicDialogsContextData> and <BasicDialogsContextApi> to split
 * the data and api of rendering basic dialogs. This technique prevents
 * unnecessary rerendering of api consumers as explained here:
 * https://www.developerway.com/posts/react-re-renders-guide
 */
interface BasicDialogType {
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  message: string;
  onConfirm?: Function;
  promptLabel?: string;
  initialPromptValue?: string;
  promptType?: 'input' | 'textarea';
  onSubmit?: (value: string) => void;
}

const BasicDialogsContextData = createContext<{
  shown: boolean;
  dialog: BasicDialogType;
}>({
  shown: false,
  dialog: {
    type: 'alert',
    title: '',
    message: '',
  },
});

const BasicDialogsContextApi = createContext<{
  setShown: Dispatch<SetStateAction<boolean>>;
  setDialog: Dispatch<SetStateAction<BasicDialogType>>;
}>({
  setShown: () => {},
  setDialog: () => {},
});

function BasicDialogsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const [dialog, setDialog] = useState<BasicDialogType>({
    type: 'alert',
    title: '',
    message: '',
  });

  /**
   * Need to memoize the value of the <BasicDialogsContextApi>, so
   * that its consumers won't re-render when this' component's states
   * changes.
   */
  const memoizedContextApiValue = useMemo(
    () => ({
      setShown,
      setDialog,
    }),
    []
  );

  return (
    <BasicDialogsContextData.Provider value={{ shown, dialog }}>
      <BasicDialogsContextApi.Provider value={memoizedContextApiValue}>
        {/* This will trigger unncessary rerenders on its consumers: <BasicDialogsContextApi.Provider value={{ setShown, setDialog }}> */}
        <BasicDialogs />
        {children}
      </BasicDialogsContextApi.Provider>
    </BasicDialogsContextData.Provider>
  );
}

export {
  BasicDialogsContextData,
  BasicDialogsContextApi,
  BasicDialogsContextProvider,
};
