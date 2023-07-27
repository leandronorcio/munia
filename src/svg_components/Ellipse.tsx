import * as React from 'react';
import { SVGProps } from 'react';
const SvgEllipse = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 9 8"
    {...props}
  >
    <circle cx={4.5} cy={4} r={4} fill="#14142B" />
  </svg>
);
export default SvgEllipse;
