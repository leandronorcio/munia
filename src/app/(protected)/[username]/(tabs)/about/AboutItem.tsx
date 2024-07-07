import { SVGProps } from 'react';

export function AboutItem({
  field,
  value,
  Icon,
}: {
  field: string;
  value: string | null;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}) {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 rounded-l-3xl bg-input p-2 sm:gap-3 sm:p-4">
        <Icon className="h-5 w-5 stroke-muted-foreground sm:h-6 sm:w-6" />
        <p className="font-medium text-muted-foreground sm:text-lg">{field}</p>
      </div>
      <p className="flex flex-1 items-center self-stretch rounded-r-3xl border border-border pl-4">
        <span className="font-semibold text-foreground sm:text-lg">{value || 'Not set'}</span>
      </p>
    </div>
  );
}
