import * as React from 'react';
import { SVGProps } from 'react';

function SvgCamera(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2 9.257A3.257 3.257 0 0 1 5.257 6a3.257 3.257 0 0 0 2.71-1.45L8 4.5A3.369 3.369 0 0 1 10.803 3h2.394c1.127 0 2.178.563 2.803 1.5l.033.05A3.257 3.257 0 0 0 18.743 6 3.257 3.257 0 0 1 22 9.257V17a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V9.257Z"
      />
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      />
    </svg>
  );
}
export default SvgCamera;
