import { CircleActionsSuccess } from '@/svg_components';

export function AllCaughtUp() {
  return (
    <div className="mb-6 grid place-items-center">
      <div className="inline-block rounded-xl bg-green-200 px-8 py-6">
        <div className="flex items-center gap-4">
          <CircleActionsSuccess
            className="stroke-green-700"
            width={24}
            height={24}
          />
          <p className="text-lg font-semibold text-green-700">All caught up!</p>
        </div>
      </div>
    </div>
  );
}
