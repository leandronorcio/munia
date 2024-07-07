import * as React from 'react';
import { SVGProps } from 'react';

function SvgArrowChevronForward(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props.strokeWidth || 2}
        d="m10 5 6.963 6.963L10 18.926"
      />
    </svg>
  );
}
export default SvgArrowChevronForward;
