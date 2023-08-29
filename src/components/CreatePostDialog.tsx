import { useRef } from 'react';
import { AriaDialogProps, useDialog } from 'react-aria';
import CreatePost from './CreatePost';

interface CreatePostDialogProps extends AriaDialogProps {}

export function CreatePostDialog(props: CreatePostDialogProps) {
  const dialogRef = useRef(null);
  const { dialogProps, titleProps } = useDialog(props, dialogRef);

  return (
    <div
      {...dialogProps}
      ref={dialogRef}
      className="grid h-full w-full place-items-center overflow-y-auto py-8"
    >
      <CreatePost titleProps={titleProps} />
    </div>
  );
}
