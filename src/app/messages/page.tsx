'use client';
import TextArea from '@/components/ui/TextArea';
import { BasicDialogsContext } from '@/contexts/BasicDialogsContext';
import { CreatePostModalContext } from '@/contexts/CreatePostModalContext';
import { ToastContext } from '@/contexts/ToastContext';
import { useContext } from 'react';

export default function Messages() {
  const { alert, confirm, prompt } = useContext(BasicDialogsContext);
  const { toastify } = useContext(ToastContext);
  const { launchCreatePost } = useContext(CreatePostModalContext);

  return (
    <>
      <h1>Messages</h1>
      <button onClick={launchCreatePost}>Launch Create Post</button>
      <button
        onClick={() => alert({ title: 'Alert', message: 'Hello there mate.' })}
      >
        Alert
      </button>
      <button
        onClick={() =>
          confirm({
            title: 'Testing',
            message: 'Hello there mate.',
            actionOnConfirm: () => {
              console.log('confirmed');
            },
          })
        }
      >
        Confirm
      </button>
      <button
        onClick={() => {
          prompt({
            title: 'Prompt',
            promptLabel: 'Enter your crush',
            initialPromptValue: 'Lorem ipsum dolor sit amet.',
            actionOnSubmit: (value) => console.log(`The value is ${value}`),
          });
        }}
      >
        Prompt
      </button>
      <button
        onClick={() =>
          toastify({
            title: 'Successfully updated.',
            type: 'success',
          })
        }
      >
        Show Toast
      </button>
      <div className="mt-4">
        <div className="relative">
          <input
            className="w-[320px] pt-8 py-2 px-5 bg-slate-200 outline-none rounded-2xl focus:ring-2 ring-black peer"
            placeholder=" "
            id="generic-input"
          />
          <label
            htmlFor="generic-input"
            className="cursor-text absolute z-0 left-5 transition-all text-gray-500 top-[9px] translate-y-0 text-sm peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-sm peer-placeholder-shown:top-[50%] peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:text-lg"
          >
            Enter name
          </label>
        </div>
      </div>
      <TextArea />
    </>
  );
}
