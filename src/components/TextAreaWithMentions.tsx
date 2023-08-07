import { ChangeEventHandler, useRef, useState } from 'react';
import { TextArea } from './ui/TextArea';
import { useQuery } from '@tanstack/react-query';
import { UserSummary } from 'types';
import { ProfilePhoto } from './ui/ProfilePhoto';
import { useClickOutside } from '@/hooks/useClickOutside';

export function TextAreaWithMentions() {
  const [value, setValue] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [mentionsShown, setMentionsShown] = useState(false);
  // `posOfActiveAt` - The position of the active '@' among the array of strings
  // when converting the `value` to an array using the `.split()` method
  const posOfActiveAt = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [containerRef] = useClickOutside(() => closeMentions());

  // This query will refetch every time the `searchKeyword` state changess
  const { data, isLoading, isError } = useQuery({
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
    const words = value.split(/\s+/);
    words[posOfActiveAt.current] = `@${username}`;
    setValue(words.join(' '));

    // The cursor position must be right after the inserted string
    const newCursorPos = words
      .slice(0, posOfActiveAt.current + 1)
      .join(' ').length;

    // Wait for the `setValue()` to finish before focusing the textarea and setting the cursor pos
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 100);

    closeMentions();
  };

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    const { target } = event;
    setValue(target.value);

    const text = target.value;
    const cursorPos = target.selectionStart;

    // While the user is typing, get the current word where the cursor is at
    const textBeforeCursor = text.slice(0, cursorPos);
    const wordsBeforeCursor = textBeforeCursor.split(/\s+/);
    const posOfWord = wordsBeforeCursor.length - 1;
    const currentWord = wordsBeforeCursor[posOfWord];

    // If the current word starts with '@', show the mentions section, otherwise hide it
    if (currentWord.startsWith('@')) {
      setSearchKeyword(currentWord.slice(1));
      setMentionsShown(true);
      posOfActiveAt.current = posOfWord;
    } else {
      closeMentions();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {mentionsShown && (
        <div className="absolute bottom-full max-h-[200px] w-full overflow-y-auto bg-slate-100 ">
          {isLoading ? (
            <div className="flex h-[60px] items-center px-4">
              Loading users...
            </div>
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
            <div className="flex h-[60px] items-center px-4">
              No users found.
            </div>
          )}
        </div>
      )}
      <TextArea
        ref={textareaRef}
        value={value}
        onChange={handleTextareaChange}
      />
    </div>
  );
}
