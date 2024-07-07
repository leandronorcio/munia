import * as React from 'react';
import { SVGProps } from 'react';

function SvgClose(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill={props.fill} viewBox="0 0 24 24" {...props}>
      <path
        strokeWidth={props.strokeWidth || 2}
        d="m6 6 6.387 6.387m0 0 6.387 6.387m-6.387-6.387L6 18.774m6.387-6.387L18.774 6"
        className="close_svg__close-svg"
      />
    </svg>
  );
}
export default SvgClose;
