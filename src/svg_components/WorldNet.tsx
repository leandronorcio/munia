import * as React from 'react';
import { SVGProps } from 'react';

function SvgWorldNet(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeWidth={1.5}
        d="M23 12c0 6.075-4.925 11-11 11m11-11c0-6.075-4.925-11-11-11m11 11H1m11 11C5.925 23 1 18.075 1 12m11 11s-4-2.2-4-11 4-11 4-11m0 22s4-2.2 4-11-4-11-4-11M1 12C1 5.925 5.925 1 12 1"
      />
    </svg>
  );
}
export default SvgWorldNet;
