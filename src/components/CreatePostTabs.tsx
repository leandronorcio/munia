import { PostVisualMediaContainer } from '@/components/PostVisualMediaContainer';
import { capitalizeFirstLetter } from '@/lib/capitalizeFirstLettet';
import { cn } from '@/lib/cn';
import { Ellipse } from '@/svg_components';
import { memo, useState } from 'react';
import { CreatePostSort } from './CreatePostSort';
import { VisualMedia } from 'types';
import { TabButton } from './TabButton';

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
              <TabButton
                title={item}
                isActive={isActive}
                onPress={() =>
                  setActiveCreatePostTab(item as 'preview' | 'sort')
                }
              />
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
