import * as React from 'react';
import { SVGProps } from 'react';

function SvgArrowReply(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.717 16 2 9m0 0 6.717-7M2 9h7c7.18 0 13 5.82 13 13"
      />
    </svg>
  );
}
export default SvgArrowReply;
