import * as React from 'react';
import { SVGProps } from 'react';

function SvgLogOutCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16.364 18.364a9 9 0 1 1 0-12.728M20 9l2.667 3L20 15m2.5-3H10"
      />
    </svg>
  );
}
export default SvgLogOutCircle;
