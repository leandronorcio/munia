import * as React from "react";
import { SVGProps } from "react";
const SvgComment = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 27 24"
    {...props}
  >
    <path d="M7.501 2a6 6 0 0 0-6 6v4c0 .24.014.477.042.71A1 1 0 0 0 1.5 13v8.826a1 1 0 0 0 1.65.759l4.788-4.104A2 2 0 0 1 9.24 18H19.5a6 6 0 0 0 6-6V8a6 6 0 0 0-6-6h-12Z" />
  </svg>
);
export default SvgComment;
