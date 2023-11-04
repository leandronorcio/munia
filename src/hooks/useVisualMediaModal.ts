import { VisualMediaModalContextApi } from '@/contexts/VisualMediaModalContext';
import { useContext } from 'react';
import { GetVisualMedia } from '@/types/definitions';

export function useVisualMediaModal() {
  const { setModal, show } = useContext(VisualMediaModalContextApi);
  const showVisualMediaModal = ({
    visualMedia,
    initialSlide,
  }: {
    visualMedia: GetVisualMedia[];
    initialSlide: number;
  }) => {
    setModal({
      visualMedia,
      initialSlide,
    });
    show();
  };

  return { showVisualMediaModal };
}
