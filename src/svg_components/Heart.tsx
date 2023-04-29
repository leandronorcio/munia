import * as React from "react";
import { SVGProps } from "react";
const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path d="M2.772 3.772a6.05 6.05 0 0 0 0 8.557l9.165 9.165.063-.063.063.063 9.165-9.165a6.05 6.05 0 1 0-8.557-8.557l-.317.318a.5.5 0 0 1-.707 0l-.318-.318a6.05 6.05 0 0 0-8.557 0Z" />
  </svg>
);
export default SvgHeart;
