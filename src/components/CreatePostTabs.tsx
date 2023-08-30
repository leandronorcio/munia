import { PostVisualMediaContainer } from '@/components/PostVisualMediaContainer';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLettet';
import { cn } from '@/lib/cn';
import { Ellipse } from '@/svg_components';
import { memo, useState } from 'react';
import { CreatePostSort } from './CreatePostSort';
import { VisualMedia } from 'types';

const CreatePostTabs = memo(function CreatePostTabs({
  visualMedia,
  setVisualMedia,
}: {
  visualMedia: VisualMedia[];
  setVisualMedia: React.Dispatch<React.SetStateAction<VisualMedia[]>>;
}) {
  const [activeCreatePostTab, setActiveCreatePostTab] = useState<
    'preview' | 'sort'
  >('preview');

  return (
    <>
      <div className={cn('border-t-2')}>
        <div className="flex justify-center">
          {['preview', 'sort'].map((item, i) => {
            const isActive = item === activeCreatePostTab;
            return (
              <div
                className="flex cursor-pointer flex-col items-center gap-2 px-3 py-4"
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
                      : 'text-gray-500 hover:text-gray-700',
                  )}
                >
                  {capitalizeFirstLetter(item)}
                </h2>
                {isActive && <Ellipse width={8} height={8} />}
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden">
          {activeCreatePostTab === 'preview' ? (
            <PostVisualMediaContainer visualMedia={visualMedia} />
          ) : (
            <CreatePostSort
              visualMedia={visualMedia}
              setVisualMedia={setVisualMedia}
            />
          )}
        </div>
      </div>
    </>
  );
});

export { CreatePostTabs };
