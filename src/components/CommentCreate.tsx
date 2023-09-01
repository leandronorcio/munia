'use client';
import Button from './ui/Button';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import SvgSend from '@/svg_components/Send';
import { useState } from 'react';
import { useCommentsMutations } from '@/hooks/mutations/useCommentsMutations';
import { useQueryClient } from '@tanstack/react-query';
import { GetComment } from 'types';
import { TextAreaWithMentionsAndHashTags } from './TextAreaWithMentionsAndHashTags';
import { useErrorNotifier } from '@/hooks/useErrorNotifier';

export function CommentCreate({ postId }: { postId: number }) {
  const [content, setContent] = useState('');
  const { createCommentMutation } = useCommentsMutations();
  const qc = useQueryClient();
  const queryKey = ['posts', postId, 'comments'];
  const { notifyError } = useErrorNotifier();

  const handleCreate = () => {
    createCommentMutation.mutate(
      { postId, content: content },
      {
        onSuccess: (createdComment) => {
          qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
            if (!oldComments) return;
            return [...oldComments, createdComment];
          });

          setContent('');
        },

        onError: (error) => notifyError(error),
      },
    );
  };

  return (
    <div className="mt-2 border-t-2 py-4">
      <div className="flex">
        <div className="mr-3 h-10 w-10">
          <ProfilePhotoOwn />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <TextAreaWithMentionsAndHashTags
            content={content}
            setContent={setContent}
            placeholder="Write your comment here..."
            shouldFocusOnMount={false}
          />
        </div>
        <div className="self-end">
          <Button
            onPress={handleCreate}
            mode="ghost"
            size="small"
            isDisabled={content === ''}
            loading={createCommentMutation.isPending}
            Icon={SvgSend}
          />
        </div>
      </div>
    </div>
  );
}
