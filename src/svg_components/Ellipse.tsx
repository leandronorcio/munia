import * as React from 'react';
import { SVGProps } from 'react';

function SvgEllipse(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 9 8" {...props}>
      <circle cx={4.5} cy={4} r={4} fill={props.fill} />
    </svg>
  );
}
export default SvgEllipse;
