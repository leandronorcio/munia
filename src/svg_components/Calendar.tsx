import * as React from 'react';
import { SVGProps } from 'react';

function SvgCalendar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 1v2m10-2v2M2 8h20M7.5 13h2m5 0h2m-9 4h2m5 0h2M5 22h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3Z"
      />
    </svg>
  );
}
export default SvgCalendar;
