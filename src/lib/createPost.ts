import { GetVisualMedia } from '@/types/definitions';

export interface ToEditValues {
  postId: number;
  initialContent: string;
  initialVisualMedia: GetVisualMedia[];
}
