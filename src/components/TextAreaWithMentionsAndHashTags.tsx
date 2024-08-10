import {
  ChangeEventHandler,
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { resizeTextAreaHeight } from '@/lib/resizeTextAreaHeight';
import { useQuery } from '@tanstack/react-query';
import { replaceWordAtCursor } from '@/lib/replaceWordAtCursor';
import { cn } from '@/lib/cn';
import { AriaTextFieldProps, mergeProps, useKeyboard, useTextField } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import { useClickOutside } from '@/hooks/useClickOutside';
import { getUsers } from '@/lib/client_data_fetching/getUsers';
import { Popover } from './ui/Popover';
import { TextAreaMentionItem } from './TextAreaMentionItem';
import { HighlightedMentionsAndHashTags } from './HighlightedMentionsAndHashTags';

interface TextAreaWithMentionsAndHashTagsProps extends AriaTextFieldProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  placeholder: string;
  shouldFocusOnMount?: boolean;
}
export function TextAreaWithMentionsAndHashTags({
  content,
  setContent,
  placeholder,
  shouldFocusOnMount = true,
  ...rest
}: TextAreaWithMentionsAndHashTagsProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [focused, setFocused] = useState<string>('');

  const posOfActiveAt = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { inputProps, labelProps, errorMessageProps } = useTextField(
    { ...rest, inputElementType: 'textarea', label: placeholder },
    textareaRef,
  );
  const { errorMessage } = rest;

  const popoverState = useOverlayTriggerState({});
  const { isOpen: mentionsShown, setOpen: setMentionsShown } = popoverState;

  // This query will refetch every time the `searchKeyword` state changess
  const { data, isPending, isError } = useQuery({
    queryKey: ['mentions', 'search', { keyword: searchKeyword }],
    queryFn: async () => getUsers({ searchKeyword }),
    staleTime: 60000 * 10,
    enabled: !!searchKeyword,
  });

  // Focus the first item when `data` changes
  useEffect(() => {
    if (!data) return;
    setFocused(data[0]?.username || '');
  }, [data]);

  const closeMentions = useCallback(() => {
    setSearchKeyword('');
    setMentionsShown(false);
    setFocused('');
    posOfActiveAt.current = 0;
  }, [setMentionsShown]);

  // Since the <Popover>'s `isNonModal` is `true`, it will not be closed
  // when the user clicks outside, but we can handle it manually
  const [popoverRef] = useClickOutside(closeMentions);

  const handleSelectUserToMention = (username: string) => {
    setContent(
      replaceWordAtCursor(content, posOfActiveAt.current, `@${username} `),
      //                                                               ^ add one space character
    );

    // The cursor position must be right after the inserted string
    const newCursorPos = posOfActiveAt.current + username.length + 2;

    // Wait for the `setContent()` to finish before resizing the textarea
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea === null) return;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      resizeTextAreaHeight(textarea);
    }, 100);

    closeMentions();
  };

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const { target } = event;
    setContent(target.value);
  };

  const handleToggleMentions = () => {
    const target = textareaRef.current;
    if (!target) return;

    const text = target.value;
    const cursorPos = target.selectionStart;

    const textBeforeCursor = text.slice(0, cursorPos);
    const wordsBeforeCursor = textBeforeCursor.split(/\s/);
    const currentWord = wordsBeforeCursor[wordsBeforeCursor.length - 1];

    /**
     * If the `currentWord` starts with '@' and the word after it satisfies the
     * username validation i.e. alphanumeric and underscore characters only, then
     * show the mentions section, otherwise hide it
     */
    if (currentWord.startsWith('@')) {
      const keyword = currentWord.slice(1);
      if (/^\w+$/.test(keyword)) {
        setSearchKeyword(keyword);
        setMentionsShown(true);

        // Save the position of the active '@'
        posOfActiveAt.current = textBeforeCursor.length - currentWord.length;
      }
    } else if (mentionsShown) closeMentions();
  };

  // Since the `TextArea` is in `absolute` position, the container won't auto-resize
  // according to the height of the `TextArea`, we can set it manually instead
  useEffect(() => {
    if (containerRef.current) containerRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
  }, [content]);

  useEffect(() => {
    // Focus the `TextArea` on mount if requested
    if (!shouldFocusOnMount) return;

    textareaRef.current?.focus();
    // Set the cursor position to the end of the `TextArea`'s value
    const start = textareaRef.current?.value.length || 0;
    textareaRef.current?.setSelectionRange(start, start);
  }, [shouldFocusOnMount]);

  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      // Propagate if mentions are not shown
      if (!mentionsShown || !data) return e.continuePropagation();

      // Allow navigating thru the mentions using the keyboard's arrow keys etc.
      const { length } = data;
      const firstIndex = 0;
      const focusedIndex = data.findIndex((user) => user.username === focused);
      const lastIndex = length - 1;

      // If the focused index is the first index, the `prevIndex` must be the `lastIndex`
      const prevIndex = focusedIndex === firstIndex ? lastIndex : focusedIndex - 1;
      // If the focused index is the last index, the `nextIndex` must be 0
      const nextIndex = focusedIndex === lastIndex ? 0 : focusedIndex + 1;

      if (['Escape', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Tab'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'Escape') return closeMentions();
      if (e.key === 'ArrowUp') return setFocused(data[prevIndex].username!);
      if (e.key === 'ArrowDown') return setFocused(data[nextIndex].username!);
      if (e.key === 'Home') return setFocused(data[firstIndex].username!);
      if (e.key === 'End') return setFocused(data[lastIndex].username!);
      if (['Enter', 'Tab'].includes(e.key)) {
        handleSelectUserToMention(data[focusedIndex].username!);
      }
      return null;
    },
    onKeyUp: (e) => {
      if (e.key === 'Escape') return;
      handleToggleMentions();
    },
  });

  return (
    <>
      {mentionsShown && (
        <Popover
          triggerRef={textareaRef}
          popoverRef={popoverRef}
          state={popoverState}
          isNonModal
          placement="top"
          className="min-w-[200px]">
          <ul className="max-h-[242px] w-full overflow-auto border border-border bg-popover outline-none">
            {isPending ? (
              <li>Loading...</li>
            ) : isError ? (
              <li>Error Loading users.</li>
            ) : data.length > 0 ? (
              data.map((user) => (
                <TextAreaMentionItem
                  key={user.id}
                  {...user}
                  {...{ handleSelectUserToMention }}
                  focused={user.username === focused}
                />
              ))
            ) : (
              <li>No users found.</li>
            )}
          </ul>
        </Popover>
      )}
      <div className="relative bg-transparent" ref={containerRef}>
        <label {...labelProps} className="sr-only">
          {placeholder}
        </label>
        <textarea
          ref={textareaRef}
          {...mergeProps(inputProps, keyboardProps, {
            value: content,
            onChange: handleTextareaChange,
            onClick: handleToggleMentions,
            onInput: (e: FormEvent<HTMLTextAreaElement>) => {
              const textarea = e.target as HTMLTextAreaElement;
              resizeTextAreaHeight(textarea);
            },
            rows: 1,
            placeholder,
          })}
          className={cn(
            'absolute top-0 block w-full resize-none overflow-hidden break-words bg-transparent text-transparent caret-foreground outline-none',
            rest.errorMessage && 'rounded-sm ring-2 ring-red-900 ring-offset-4 placeholder:text-red-900',
          )}
        />
        <p className="whitespace-pre-wrap break-words bg-transparent">
          <HighlightedMentionsAndHashTags text={content} />
        </p>
      </div>
      {errorMessage !== undefined && (
        <p {...errorMessageProps} className="mt-4 font-semibold text-red-800">
          {errorMessage as string}
        </p>
      )}
    </>
  );
}
