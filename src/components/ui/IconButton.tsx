import { SVGProps } from 'react';

interface IconButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export function IconButton({ Icon, ...rest }: IconButtonProps) {
  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2 ring-blue-300 hover:bg-blue-200 active:ring-4"
      {...rest}
    >
      <Icon width={24} height={24} />
    </div>
  );
}
