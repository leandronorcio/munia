import * as React from 'react';
import { SVGProps } from 'react';
const SvgActionsPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      stroke={props.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 2v12M2 8h12"
    />
  </svg>
);
export default SvgActionsPlus;
