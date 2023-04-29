import * as React from 'react';
import { SVGProps } from 'react';
const SvgLogInSquare = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke={props.stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5V2h14v20H9v-3m4-10 2.667 3L13 15m2.5-3H1"
    />
  </svg>
);
export default SvgLogInSquare;
