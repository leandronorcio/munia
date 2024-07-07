import * as React from 'react';
import { SVGProps } from 'react';

function SvgBullhorn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeWidth={1.5}
        d="m12.28 14.304.72 7.262c0 1-1.306 1.38-1.844.537L3 12.523M18 13a3 3 0 1 0 0-6m0-4v14s-3.713-2.424-7-3c-1.364-.239-3.288-.266-5.007-.222C3.846 13.833 2 12.148 2 10s1.846-3.833 3.993-3.778C7.712 6.266 9.636 6.24 11 6c3.287-.576 7-3 7-3Z"
      />
    </svg>
  );
}
export default SvgBullhorn;
