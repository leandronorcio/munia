import * as React from "react";
import { SVGProps } from "react";
const SvgMore = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#14142B"
      d="M7 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM17 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
    />
  </svg>
);
export default SvgMore;
