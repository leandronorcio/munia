import * as React from 'react';
import { SVGProps } from 'react';

function SvgFeather(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeWidth={1.5}
        d="M9.941 14.294h8.236m-17.06 8.824L15.236 9M4.647 11.353l8.235-8.235a5.823 5.823 0 0 1 8.236 8.235l-8.236 8.235L5.235 19l-.588-7.647Z"
      />
    </svg>
  );
}
export default SvgFeather;
