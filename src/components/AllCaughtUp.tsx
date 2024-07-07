import { CircleActionsSuccess } from '@/svg_components';

export function AllCaughtUp() {
  return (
    <div className="grid place-items-center">
      <div className="inline-block rounded-xl bg-success px-8 py-6">
        <div className="flex items-center gap-4">
          <CircleActionsSuccess className="stroke-success-foreground" width={24} height={24} />
          <p className="text-lg font-semibold text-success-foreground">All caught up!</p>
        </div>
      </div>
    </div>
  );
}
