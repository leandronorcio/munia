'use client';

import * as React from 'react';
import { SVGProps } from 'react';

function SvgBackArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 16" {...props}>
      <path
        fill={props.fill}
        d="M8.439 1.692A1 1 0 1 0 6.996.308l1.443 1.384ZM1 8 .28 7.308a1 1 0 0 0 0 1.384L1 8Zm5.996 7.692a1 1 0 0 0 1.443-1.384l-1.443 1.384Zm-4.729-8.66a1 1 0 1 0 0 2v-2Zm15.733 2a1 1 0 1 0 0-2v2ZM6.996.308l-6.717 7 1.443 1.384 6.717-7L6.996.308ZM.279 8.692l6.717 7 1.443-1.384-6.717-7L.279 8.692Zm1.988.34H18v-2H2.267v2Z"
      />
    </svg>
  );
}
export default SvgBackArrow;
