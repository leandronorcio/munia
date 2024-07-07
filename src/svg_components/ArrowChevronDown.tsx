import * as React from 'react';
import { SVGProps } from 'react';

function SvgArrowChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m18.926 10-6.963 6.963L4.999 10"
      />
    </svg>
  );
}
export default SvgArrowChevronDown;
