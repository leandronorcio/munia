import PostVisualMediaContainer from '@/components/PostVisualMediaContainer';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLettet';
import { cn } from '@/lib/cn';
import { Ellipse } from '@/svg_components';
import { memo, useState } from 'react';

const CreatePostTabs = memo(
  function CreatePostTabs({ visualMediaFiles }: { visualMediaFiles: File[] }) {
    const [activeCreatePostTab, setActiveCreatePostTab] = useState<
      'preview' | 'sort'
    >('preview');
    console.log('CreatePostTabs rendered');
    return (
      <>
        {visualMediaFiles.length > 0 && (
          <div className="overflow-x-hidden border-t-2 mt-4">
            <div className="flex justify-center">
              {['preview', 'sort'].map((item, i) => {
                // Hide the Sort tab when there is only one selected file.
                if (visualMediaFiles.length === 1 && i === 1) return false;
                const isActive = item === activeCreatePostTab;
                return (
                  <div
                    className="flex flex-col gap-2 items-center px-3 py-4 cursor-pointer"
                    onClick={() =>
                      setActiveCreatePostTab(item as 'preview' | 'sort')
                    }
                    key={item}
                  >
                    <h2
                      className={cn(
                        'text-xl font-semibold',
                        isActive
                          ? 'text-black'
                          : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      {capitalizeFirstLetter(item)}
                    </h2>
                    {isActive && <Ellipse width={8} height={8} />}
                  </div>
                );
              })}
            </div>

            <div
              className={cn(
                'flex w-[200%] transition-transform duration-500',
                activeCreatePostTab === 'sort' && 'translate-x-[-50%]'
              )}
            >
              <div className="bg-red-500 basis-1/2">
                <PostVisualMediaContainer
                  visualMedia={visualMediaFiles.map((file) => ({
                    type: file.type.startsWith('image/') ? 'PHOTO' : 'VIDEO',
                    url: URL.createObjectURL(file),
                  }))}
                />
              </div>
              <div className="bg-green-500 basis-1/2"></div>
            </div>
          </div>
        )}
      </>
    );
  },
  (oldProps, newProps) => {
    // Memoize this component to prevent expensive rerenders everytime the <CreatePost>'s <content> state changes.
    const oldFiles = oldProps.visualMediaFiles;
    const newFiles = newProps.visualMediaFiles;

    if (oldFiles.length !== newFiles.length) return false;

    for (let i = 0; i < oldFiles.length; i++) {
      const oldFile = oldFiles[i];
      const newFile = newFiles[i];

      if (!(oldFile instanceof File) || !(newFile instanceof File)) {
        return false;
      }

      // Check if the properties of the files match
      if (oldFile.name !== newFile.name) {
        return false;
      }

      if (oldFile.size !== newFile.size) {
        return false;
      }

      if (oldFile.type !== newFile.type) {
        return false;
      }
    }

    return true;
  }
);

export { CreatePostTabs };
