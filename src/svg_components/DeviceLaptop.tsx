import * as React from 'react';
import { SVGProps } from 'react';

function SvgDeviceLaptop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeWidth={1.5}
        d="M23 15h-6.25c-.787 0-1.528-.13-2 .5s-1.213.5-2 .5h-1.171c-.845 0-1.648.136-2.204-.5-.556-.636-1.36-.5-2.204-.5H1m22 .444V7a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v8.444A3.556 3.556 0 0 0 4.556 19h14.888A3.556 3.556 0 0 0 23 15.444Z"
      />
    </svg>
  );
}
export default SvgDeviceLaptop;
