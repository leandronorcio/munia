'use client';

import * as React from 'react';
import { SVGProps } from 'react';

function SvgLogInSquare(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5V2h14v20H9v-3m4-10 2.667 3L13 15m2.5-3H1"
      />
    </svg>
  );
}
export default SvgLogInSquare;
