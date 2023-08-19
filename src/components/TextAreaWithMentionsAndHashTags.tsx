import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TextArea, resizeTextAreaHeight } from './ui/TextArea';
import { useQuery } from '@tanstack/react-query';
import { UserSummary } from 'types';
import { ProfilePhoto } from './ui/ProfilePhoto';
import { useClickOutside } from '@/hooks/useClickOutside';
import { replaceWordAtCursor } from '@/lib/replaceWordAtCursor';
import { cn } from '@/lib/cn';
import { HighlightedMentionsAndHashTags } from './HighlightedMentionsAndHashTags';

interface TextAreaWithMentionsAndHashTags
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  shouldFocusOnMount?: boolean;
}
export function TextAreaWithMentionsAndHashTags({
  content,
  setContent,
  shouldFocusOnMount = true,
  ...rest
}: TextAreaWithMentionsAndHashTags) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [mentionsShown, setMentionsShown] = useState(false);

  const posOfActiveAt = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [containerRef] = useClickOutside(() => closeMentions());

  // This query will refetch every time the `searchKeyword` state changess
  const { data, isPending, isError } = useQuery({
    queryKey: ['mentions', 'search', { keyword: searchKeyword }],
    queryFn: async () => {
      const res = await fetch(`/api/users-basic?search=${searchKeyword}`);
      if (!res.ok) {
        throw new Error('Error fetching users to mention.');
      }
      return (await res.json()) as UserSummary[];
    },
    staleTime: 60000 * 10,
  });

  const closeMentions = () => {
    setSearchKeyword('');
    setMentionsShown(false);
    posOfActiveAt.current = 0;
  };

  const handleSelectUserToMention = (username: string) => {
    setContent(
      replaceWordAtCursor(content, posOfActiveAt.current, `@${username}`),
    );

    // The cursor position must be right after the inserted string
    const newCursorPos = posOfActiveAt.current + username.length + 1;

    // Wait for the `setContent()` to finish before focusing the textarea and setting the cursor pos
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea === null) return;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      resizeTextAreaHeight(textarea);
    }, 100);

    closeMentions();
  };

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    const { target } = event;
    setContent(target.value);

    const text = target.value;
    const cursorPos = target.selectionStart;

    // While the user is typing, get the current word where the cursor is at
    const textBeforeCursor = text.slice(0, cursorPos);
    const wordsBeforeCursor = textBeforeCursor.split(/\s/);
    // If the current word starts with '@', the '@' will be included in `currentWord`
    const currentWord = wordsBeforeCursor[wordsBeforeCursor.length - 1];
    const word = currentWord.slice(1);

    /**
     * If the current word starts with '@' and the `word` after it satisfies the
     * username validation i.e. alphanumeric and underscore characters only, then
     * show the mentions section, otherwise hide it.
     */
    if (currentWord.startsWith('@') && /^\w+$/.test(word)) {
      setSearchKeyword(currentWord.slice(1));
      setMentionsShown(true);

      // Save the position of the active '@'
      posOfActiveAt.current = textBeforeCursor.length - currentWord.length;
    } else {
      closeMentions();
    }
  };

  // Since the `TextArea` is in `absolute` position, the container won't auto-resize
  // according to the height of the `TextArea`, we can set it manually instead
  useEffect(() => {
    if (containerRef.current)
      containerRef.current.style.height =
        textareaRef.current?.scrollHeight + 'px';
  }, [content]);

  // Focus the `TextArea` on mount if requested
  useEffect(() => {
    if (!shouldFocusOnMount) return;

    textareaRef.current?.focus();
    // Set the cursor position to the end of the `TextArea`'s value
    const start = content.length;
    textareaRef.current?.setSelectionRange(start, start);
  }, [textareaRef]);

  return (
    <div className="relative bg-transparent" ref={containerRef}>
      {mentionsShown && (
        <div className="absolute bottom-full max-h-[200px] w-full overflow-y-auto bg-slate-100">
          {isPending ? (
            <div className="flex items-center px-4">Loading users...</div>
          ) : isError ? (
            'Error loading users.'
          ) : data.length > 0 ? (
            data.map((user) => (
              <div
                onClick={() => handleSelectUserToMention(user.username!)}
                key={user.id}
                className="flex cursor-pointer items-center gap-3 border-b-2 px-4 py-2 last:border-b-0 hover:bg-slate-200/70"
              >
                <div className="h-8 w-8">
                  <ProfilePhoto
                    userId={user.id}
                    username={user.username}
                    photoUrl={user.profilePhoto}
                  />
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center px-4">No users found.</div>
          )}
        </div>
      )}
      <TextArea
        ref={textareaRef}
        value={content}
        onChange={handleTextareaChange}
        className={cn(
          'absolute top-0 break-words bg-transparent text-transparent caret-black',
          rest.className,
        )}
        {...rest}
      />
      <p className="whitespace-pre-wrap break-words bg-transparent">
        <HighlightedMentionsAndHashTags text={content} />
      </p>
    </div>
  );
}
