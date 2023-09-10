import { Loading } from '@/svg_components';

export function LoadingPage() {
  return (
    <div className="mt-6 flex flex-col items-center gap-5">
      <div>
        <Loading className="h-12 w-12 animate-spin stroke-foreground" />
      </div>
      <p className="text-lg">Loading page</p>
    </div>
  );
}
