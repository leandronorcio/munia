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
      <div className="flex items-center gap-3 rounded-l-3xl bg-input p-4">
        <Icon className="h-6 w-6 stroke-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">{field}</p>
      </div>
      <p className="flex flex-1 items-center self-stretch rounded-r-3xl border border-border pl-4">
        <span className="text-lg font-semibold text-foreground">
          {value || 'Not set'}
        </span>
      </p>
    </div>
  );
}
