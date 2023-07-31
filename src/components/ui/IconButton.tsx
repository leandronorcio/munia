import SvgLoader from '@/svg_components/Loader';
import { SVGProps } from 'react';

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export function IconButton({ loading, Icon, ...rest }: IconButtonProps) {
  return (
    <button
      className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2 ring-violet-300 hover:bg-violet-200 active:ring-4"
      disabled={loading}
      {...rest}
    >
      {!loading ? (
        <Icon width={24} height={24} />
      ) : (
        <SvgLoader
          width={24}
          height={24}
          className="animate-spin fill-violet-800 text-violet-300"
        />
      )}
    </button>
  );
}
