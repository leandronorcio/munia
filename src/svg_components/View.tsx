import * as React from 'react';
import { SVGProps } from 'react';

function SvgView(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <g stroke={props.stroke} strokeWidth={2}>
        <path
          d="M1.335 13.256a2.522 2.522 0 0 1 0-2.512C3.685 6.651 7.444 4 11.68 4c4.236 0 7.995 2.65 10.345 6.744a2.522 2.522 0 0 1 0 2.512C19.675 17.349 15.915 20 11.68 20c-4.236 0-7.995-2.65-10.345-6.744Z"
          className="view_svg__view-svg"
        />
        <path d="M14.68 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" className="view_svg__view-svg" />
      </g>
    </svg>
  );
}
export default SvgView;
