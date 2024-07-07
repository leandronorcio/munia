import * as React from 'react';
import { SVGProps } from 'react';

function SvgCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeWidth={props.strokeWidth || 2}
        d="m4 12.314 5.657 5.656L20.97 6.657"
      />
    </svg>
  );
}
export default SvgCheck;
