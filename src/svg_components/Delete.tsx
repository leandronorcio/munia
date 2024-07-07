import * as React from 'react';
import { SVGProps } from 'react';

function SvgDelete(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeWidth={2}
        d="M17 5V4a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v1M1 5h22m-8 6v5m-6-5v5M3 5h18l-.663 13.25A5 5 0 0 1 15.344 23H8.656a5 5 0 0 1-4.994-4.75L3 5Z"
      />
    </svg>
  );
}
export default SvgDelete;
