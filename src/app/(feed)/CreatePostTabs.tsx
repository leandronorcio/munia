import PostVisualMediaContainer from '@/components/PostVisualMediaContainer';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLettet';
import { cn } from '@/lib/cn';
import { Ellipse } from '@/svg_components';
import { useState } from 'react';

export function CreatePostTabs({
  visualMediaFiles,
}: {
  visualMediaFiles: File[];
}) {
  const [activeCreatePostTab, setActiveCreatePostTab] = useState<
    'preview' | 'sort'
  >('preview');
  return (
    <>
      {visualMediaFiles.length > 0 && (
        <div className="overflow-x-hidden">
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
}
