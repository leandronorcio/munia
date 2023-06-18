import { createContext } from 'react';

const PhotosModalContext = createContext({});

function PhotosModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PhotosModalContext.Provider value={{}}>
      {children}
    </PhotosModalContext.Provider>
  );
}

export { PhotosModalContext, PhotosModalContextProvider };
