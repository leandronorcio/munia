import * as React from 'react';
import { SVGProps } from 'react';
const SvgCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke={props.stroke || 'black'}
      strokeLinecap="round"
      strokeWidth={props.strokeWidth || 2}
      d="m4 12.314 5.657 5.656L20.97 6.657"
    />
  </svg>
);
export default SvgCheck;
