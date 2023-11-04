import { PostVisualMediaContainer } from '@/components/PostVisualMediaContainer';
import { memo, useState } from 'react';
import { CreatePostSort } from './CreatePostSort';
import { GetVisualMedia } from '@/types/definitions';
import { TabButton } from './TabButton';

const CreatePostTabs = memo(function CreatePostTabs({
  visualMedia,
  setVisualMedia,
}: {
  visualMedia: GetVisualMedia[];
  setVisualMedia: React.Dispatch<React.SetStateAction<GetVisualMedia[]>>;
}) {
  const [activeCreatePostTab, setActiveCreatePostTab] = useState<
    'preview' | 'sort'
  >('preview');

  return (
    <>
      <div className="border-t border-t-border">
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
                key={item}
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
