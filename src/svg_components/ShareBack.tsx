import * as React from 'react';
import { SVGProps } from 'react';

function SvgShareBack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 26" {...props}>
      <path
        stroke={props.stroke}
        strokeWidth={2}
        d="M9.826 9.194V5L2 12.13l7.826 7.13v-4.194s2.174-.42 6.087 1.258S22 20 22 20s-.87-4.85-4.783-7.87c-3.913-3.02-7.39-2.936-7.39-2.936Z"
      />
    </svg>
  );
}
export default SvgShareBack;
