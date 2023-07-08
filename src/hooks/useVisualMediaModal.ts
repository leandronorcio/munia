import { VisualMediaModalContextApi } from '@/contexts/VisualMediaModalContext';
import { useContext } from 'react';
import { VisualMedia } from 'types';

export function useVisualMediaModal() {
  const { setModal, setShown } = useContext(VisualMediaModalContextApi);
  const showVisualMediaModal = ({
    visualMedia,
    initialSlide,
  }: {
    visualMedia: VisualMedia[];
    initialSlide: number;
  }) => {
    setModal({
      visualMedia,
      initialSlide,
    });
    setShown(true);
  };

  return { showVisualMediaModal };
}
