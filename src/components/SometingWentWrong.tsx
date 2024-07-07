import { CircleActionsAlertInfo } from '@/svg_components';

export function SomethingWentWrong() {
  return (
    <div className="mt-6 grid place-items-center">
      <div className="inline-block rounded-xl bg-destructive px-8 py-6">
        <div className="flex items-center gap-4">
          <CircleActionsAlertInfo className="stroke-destructive-foreground" width={24} height={24} />
          <p className="text-lg font-semibold text-destructive-foreground">Something went wrong.</p>
        </div>
      </div>
    </div>
  );
}
