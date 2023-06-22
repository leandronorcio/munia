import PostVisualMediaContainer from '@/components/PostVisualMediaContainer';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLettet';
import { cn } from '@/lib/cn';
import { Ellipse } from '@/svg_components';
import { memo, useState } from 'react';

const CreatePostTabs = memo(
  function CreatePostTabs({ visualMedia }: { visualMedia: VisualMedia[] }) {
    const [activeCreatePostTab, setActiveCreatePostTab] = useState<
      'preview' | 'sort'
    >('preview');

    console.log('rendered');
    return (
      <>
        <div
          className={cn(
            'overflow-x-hidden border-t-2 mt-4',
            visualMedia.length > 0 ? 'block' : 'hidden'
          )}
        >
          <div className="flex justify-center">
            {['preview', 'sort'].map((item, i) => {
              // Hide the Sort tab when there is only one selected file.
              if (visualMedia.length === 1 && i === 1) return false;
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
            <div className="basis-1/2">
              <PostVisualMediaContainer visualMedia={visualMedia} />
            </div>
            <div className="basis-1/2"></div>
          </div>
        </div>
      </>
    );
  },
  (oldProps, newProps) => {
    // Memoize this component to prevent expensive rerenders everytime the <CreatePost>'s <content> state changes.
    const oldFiles = oldProps.visualMedia;
    const newFiles = newProps.visualMedia;

    if (oldFiles.length !== newFiles.length) return false;

    for (let i = 0; i < oldFiles.length; i++) {
      const oldFile = oldFiles[i];
      const newFile = newFiles[i];

      // Check if the properties of the files match
      if (oldFile.type !== newFile.type) return false;
      if (oldFile.url !== newFile.url) return false;
    }

    return true;
  }
);

export { CreatePostTabs };
