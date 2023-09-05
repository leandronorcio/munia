import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { chunk } from 'lodash';
import { GetPost, PostIds } from 'types';
import { useToast } from '../useToast';
import { useSession } from 'next-auth/react';
import { useCreatePost } from '../useCreatePost';
import { GetVisualMedia } from 'types';
import { POSTS_PER_PAGE } from '@/constants';
import { useErrorNotifier } from '../useErrorNotifier';

export function useCreateUpdatePostMutations({
  content,
  visualMedia,
}: {
  content: string;
  visualMedia: GetVisualMedia[];
}) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const queryKey = ['users', session?.user?.id, 'posts'];
  const { exitCreatePostModal } = useCreatePost();
  const { showToast } = useToast();
  const { notifyError } = useErrorNotifier();

  const generateFormData = async (): Promise<FormData> => {
    const formData = new FormData();
    if (content) formData.append('content', content);

    for (const item of visualMedia) {
      const file = await fetch(item.url).then((r) => r.blob());
      formData.append('files', file, file.name);
    }
    console.log(formData);
    return formData;
  };

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts`, {
        method: 'POST',
        body: await generateFormData(),
      });

      if (!res.ok) throw new Error(res.statusText);
      // Return the created post to be used by callbacks.
      return (await res.json()) as GetPost;
    },
    onSuccess: (createdPost) => {
      // Create a query for the created post
      qc.setQueryData(['posts', createdPost.id], createdPost);

      // Update the inifinite query of `PostIds[]`
      qc.setQueriesData<InfiniteData<PostIds[]>>({ queryKey }, (oldData) => {
        if (!oldData) return;

        // Flatten the old pages first then prepend the newly created post
        const newPosts = [
          { id: createdPost.id, commentsShown: false },
          ...oldData?.pages.flat(),
        ];

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
      });
      showToast({ title: 'Successfully Posted', type: 'success' });
      exitCreatePostModal();
    },
    onError: (err) => {
      notifyError(err, 'Error Creating Post');
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        body: await generateFormData(),
      });

      if (!res.ok) throw new Error(res.statusText);
      // Return the created post to be used by callbacks.
      return (await res.json()) as GetPost;
    },
    onSuccess: (updatedPost) => {
      // Update the query for the updated post
      qc.setQueryData(['posts', updatedPost.id], updatedPost);

      // Update the inifinite query of `PostIds[]` TODO: There might be no need for `setQueriesData`
      qc.setQueriesData<InfiniteData<PostIds[]>>({ queryKey }, (oldData) => {
        if (!oldData) return;

        // Flatten the old pages first
        const oldPosts = oldData?.pages.flat();

        // Find the index of the updated post
        const index = oldPosts?.findIndex((post) => post.id === updatedPost.id);

        // Write the updated post
        oldPosts[index] = {
          id: updatedPost.id,
          commentsShown: false,
        };

        return {
          pages: chunk(oldPosts, POSTS_PER_PAGE),
          pageParams: oldData.pageParams,
        };
      });
      showToast({ title: 'Successfully Edited', type: 'success' });
      exitCreatePostModal();
    },
    onError: (err) => {
      notifyError(err, 'Error Creating Post');
    },
  });

  return { createPostMutation, updatePostMutation };
}
