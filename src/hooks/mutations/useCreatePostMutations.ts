import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { chunk } from 'lodash';
import { GetPost } from 'types';
import { useToast } from '../useToast';
import { useSession } from 'next-auth/react';
import { useCreatePost } from '../useCreatePost';
import { VisualMedia } from 'types';
import { POSTS_PER_PAGE } from '@/constants';

export function useCreatePostMutations({
  content,
  visualMedia,
}: {
  content: string;
  visualMedia: VisualMedia[];
}) {
  const qc = useQueryClient();
  const { exitCreatePostModal } = useCreatePost();
  const { showToast } = useToast();
  const { data: session } = useSession();

  const generateFormData = async (): Promise<FormData> => {
    const formData = new FormData();
    formData.append('content', content);

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
     * The difference between set() and append() is that if the specified key already exists, set() will overwrite all existing values with the new one, whereas append() will append the new value onto the end of the existing set of values.
     */
    for (const item of visualMedia) {
      const file = await fetch(item.url).then((r) => r.blob());
      formData.append('files', file, file.name);
    }

    return formData;
  };

  const createPostMutation = useMutation(
    async () => {
      const res = await fetch(`/api/posts`, {
        method: 'POST',
        body: await generateFormData(),
      });

      if (!res) {
        throw Error('Error creating post.');
      }

      // Return the created post to be used by callbacks.
      return (await res.json()) as GetPost;
    },
    {
      onSuccess: (createdPost) => {
        qc.setQueryData<InfiniteData<GetPost[]>>(
          ['users', session?.user?.id, 'profile', 'posts'],
          (oldData) => {
            if (!oldData) return;

            // Flatten the old pages first then prepend the newly created post
            const newPosts = [createdPost, ...oldData?.pages.flat()];

            // Chunk the `newPosts` depending on the number of posts per page
            const newPages = chunk(newPosts, POSTS_PER_PAGE);

            const newPageParams = [
              // The first `pageParam` is undefined as the initial page does not use a `pageParam`
              undefined,
              // Create the new `pageParams`, it must contain the id of each page's (except last page's) last post
              ...newPages.slice(0, -1).map((page) => page.at(-1)?.id),
            ];

            return {
              pages: newPages,
              pageParams: newPageParams,
            };
          }
        );
        showToast({ title: 'Successfully Posted', type: 'success' });
        exitCreatePostModal();
      },
      onError: () => {
        showToast({ title: 'Error Creating Post', type: 'error' });
      },
    }
  );

  const updatePostMutation = useMutation(
    async ({ postId }: { postId: number }) => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        body: await generateFormData(),
      });

      if (!res) {
        throw Error('Failed to edit post.');
      }

      // Return the created post to be used by callbacks.
      return (await res.json()) as GetPost;
    },
    {
      onSuccess: (updatedPost) => {
        qc.setQueryData<InfiniteData<GetPost[]>>(
          ['users', session?.user?.id, 'profile', 'posts'],
          (oldData) => {
            if (!oldData) return;

            // Flatten the old pages first
            const oldPosts = oldData?.pages.flat();

            // Find the index of the updated post
            const index = oldPosts?.findIndex(
              (post) => post.id === updatedPost.id
            );

            // Write the updated post
            oldPosts[index] = updatedPost;

            return {
              pages: chunk(oldPosts, POSTS_PER_PAGE),
              pageParams: oldData.pageParams,
            };
          }
        );
        showToast({ title: 'Successfully Edited', type: 'success' });
        exitCreatePostModal();
      },
      onError: () => {
        showToast({ title: 'Error Editing Post', type: 'error' });
      },
    }
  );

  return { createPostMutation, updatePostMutation };
}
