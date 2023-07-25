import { CircleActionsSuccess } from '@/svg_components';

export function AllCaughtUp() {
  return (
    <div className="grid place-items-center mb-6">
      <div className="px-8 py-6 inline-block rounded-xl bg-green-200">
        <div className="flex items-center gap-4">
          <CircleActionsSuccess
            className="stroke-green-700"
            width={24}
            height={24}
          />
          <p className="text-green-700 font-semibold text-lg">All caught up!</p>
        </div>
      </div>
    </div>
  );
}
