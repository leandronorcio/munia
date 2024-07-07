import * as React from 'react';
import { SVGProps } from 'react';

function SvgFullScreenExpandResize(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke || 'black'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={props.strokeWidth || 2}
        d="M15.214 3.649h5.274v5.29m-.976-4.427L14.5 9.524m5.87 5.19v5.275h-5.29m4.427-.977L14.5 14.5m-5.588 5.512H3.637V14.72m.979 4.19 4.884-4.41M3.63 8.915V3.64H8.92m-4.19.979L9.61 9.5"
      />
    </svg>
  );
}
export default SvgFullScreenExpandResize;
