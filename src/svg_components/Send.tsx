import * as React from 'react';
import { SVGProps } from 'react';

function SvgSend(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 25 25" {...props}>
      <path
        stroke={props.stroke}
        strokeWidth={2}
        d="M2.227 12.827c-.828-.318-.862-1.477-.055-1.844l18.735-8.516c.841-.382 1.706.483 1.324 1.325l-8.516 18.735c-.367.807-1.525.772-1.844-.055l-2.52-6.551a1 1 0 0 0-.573-.574l-6.551-2.52Z"
      />
    </svg>
  );
}
export default SvgSend;
